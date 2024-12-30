import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { responseMessage } from "src/utils/constant";
import { CreateOrderDetails, CreateOrders, Orders } from "src/management_portal/orders/entity/order.entity";
import { CreateOrderRequestData } from "src/management_portal/orders/interface/order.interface";
import { BillingService } from "../../billings/providers/billing.service";
import { TransactionService } from "src/management_portal/transactions/providers/transaction.service";
// import { Products } from "src/management_portal/products/entity/product.entity";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { generateCode } from "../../../utils/common";

@Injectable()
export class OrderService {
  constructor(
    // @InjectRepository(OrderDetails)
    // private readonly orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    // @InjectRepository(OrderDiscount)
    // private readonly orderDiscountRepository: Repository<OrderDiscount>,
    // @InjectRepository(Products)
    // private readonly productRepository: Repository<Products>,
    // @InjectRepository(Billings)
    // private readonly billingsRepository: Repository<Billings>,
    // @InjectRepository(Transactions)
    // private readonly transactionsRepository: Repository<Transactions>,
    @InjectRepository(CreateOrders)
    private readonly createOrderRepository: Repository<CreateOrders>,

    @InjectRepository(CreateOrderDetails)
    private readonly createOrderDetailsRepository: Repository<CreateOrderDetails>,

    private readonly billingService: BillingService,
    private readonly transactionService: TransactionService,
    private readonly logger: LoggerService
  ) {}

  async findOrder(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      const queryBuilder = this.ordersRepository
        .createQueryBuilder("orders")
        .leftJoinAndSelect("orders.billing", "billings")
        .leftJoinAndSelect("orders.transaction", "transactions")
        .leftJoinAndSelect("orders.user", "users")
        .leftJoinAndSelect("orders.sale_channel", "sale_channels")
        .leftJoinAndSelect("orders.gateway", "gateways")
        .leftJoinAndSelect("orders.flight", "flights")
        .leftJoinAndSelect("orders.order_details", "orderDetails")
        .leftJoinAndSelect("orderDetails.product", "products")
        .leftJoinAndSelect("products.price", "product_price")
        .orderBy("orders.created_date", "DESC"); // Correctly join ProductPrice through Products

      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            // Because order_number and billing_number when converting is overflow int
            if (filters.length <= 10) {
              qb.orWhere("orderDetails.product_id = :productId", { productId: filters });
            } else if (this.isValidUUID(filters)) {
              qb.orWhere("users.id = :filters", { filters: filters });
            } else {
              qb.orWhere("orders.order_number = :filters", { filters: filters }).orWhere("billings.billing_number = :filters", { filters: filters });
            }
          })
        );
      }

      const [orderListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);
      const transformedData = orderListData.map((order) => ({
        ...order,
        order_details: order.order_details.map((detail) => ({
          ...detail,
          product: {
            ...detail.product,
            price: detail.product.price,
          },
        })),
      }));
      return {
        data: transformedData.length > 0 ? transformedData : [],
        total: total,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleCreateOrder(dataCreateOrder: CreateOrderRequestData): Promise<any> {
    try {
      const { idFlight, idGateway, idSaleChannel, idUser, itemList, note, shippingMethod, subtotal, taxFee, total, totalDiscount, totalQuantity } = dataCreateOrder.data;

      const billingData = await this.billingService.handleAddBilling(total, totalQuantity);
      const transactionData = await this.transactionService.handleAddTransaction(total, subtotal);

      const idBilling = billingData.id;
      const idTransaction = transactionData.id;

      const count = await this.ordersRepository.count();

      // Generate a new billing number
      const newOrderNumber = generateCode(count + 1);

      const newOrder = this.createOrderRepository.create({
        user_id: idUser,
        billing_id: idBilling,
        transaction_id: idTransaction,
        gateway_id: idGateway,
        flight_id: idFlight,
        order_number: newOrderNumber,
        sale_channels_id: idSaleChannel,
        subtotal,
        total,
        total_discount: totalDiscount,
        total_quantity: totalQuantity,
        tax_fee: taxFee,
        shipping_method: shippingMethod,
        note,
        fulfillment_status_id: 2,
        payment_status_id: 1,
        status_id: 14,
      });

      const addOrderData = await this.createOrderRepository.save(newOrder);
      const idOrder = addOrderData.id;

      itemList.map(async (item: any) => {
        const newOrderDetail = this.createOrderDetailsRepository.create({
          order_id: idOrder,
          product_id: item.productId,
          quantity: item.quantity,
        });

        await this.createOrderDetailsRepository.save(newOrderDetail);
      });
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async totalRevenue(flightId: number, startDate: Date, endDate: Date) {
    try {
      const queryBuilder = this.ordersRepository.createQueryBuilder("orders");
      if (startDate && endDate) {
        queryBuilder.where("orders.created_date BETWEEN :startDate AND :endDate", { startDate, endDate });
      }
      if (flightId) {
        queryBuilder.andWhere("orders.flight_id = :flightId", { flightId: flightId });
      }
      const [revenue, count] = await queryBuilder.getManyAndCount();
      if (count <= 0) return { code: -4, message: responseMessage.notFound, total: 0 };
      const totalRevenue = this.calculateTotalRevenue(revenue);
      return { code: 0, message: responseMessage.success, total: totalRevenue };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  private calculateTotalRevenue(revenues: any): number {
    return revenues.reduce((total, revenue) => total + revenue.total, 0);
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(value);
  }
}
