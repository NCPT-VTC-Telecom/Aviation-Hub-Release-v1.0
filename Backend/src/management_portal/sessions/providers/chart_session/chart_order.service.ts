import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChartOrderSaleChannelService, ChartOrderPurchasesService } from "../calculate_chart/calculate_chart_order.service";
import { ChartOrderPurchasesDateService } from "../calculate_chart/calculate_chart_order_date.service";
import { responseMessage } from "src/utils/constant";
import { LoggerService } from "../../../common/logger_service/providers/log_service/log_service.service";
import { OrderProductDateChart, OrderPurchaseSaleChannelsChart, OrdersPurchaseChart } from "../../entity/session_order_chart.entity";

@Injectable()
export class ChartOrderService {
  constructor(
    @InjectRepository(OrdersPurchaseChart)
    private readonly ordersPurchaseChartRepository: Repository<OrdersPurchaseChart>,

    @InjectRepository(OrderProductDateChart)
    private readonly orderProductDateChartRepository: Repository<OrderProductDateChart>,

    @InjectRepository(OrderPurchaseSaleChannelsChart)
    private readonly orderPurchaseSaleChannelsChartRepository: Repository<OrderPurchaseSaleChannelsChart>,

    private readonly chartOrderPurchases: ChartOrderPurchasesService,
    private readonly chartOrderSaleChannelService: ChartOrderSaleChannelService,
    private readonly chartOrderPurchasesDate: ChartOrderPurchasesDateService,
    private readonly logger: LoggerService
  ) {}

  async chartOrders(type: string, fromDate: string, endDate: string): Promise<any> {
    try {
      const startDate = new Date(fromDate);
      const endDateObj = new Date(endDate);
      startDate.setHours(0, 0, 0, 0); // Set to 00:00:00
      endDateObj.setHours(23, 59, 59, 999);

      switch (type) {
        case "number_purchases_plan": {
          const queryBuilder = this.ordersPurchaseChartRepository
            .createQueryBuilder("orders")
            .select("products.title", "productTitle")
            .addSelect("SUM(order_details.quantity)", "totalQuantity")
            .innerJoin("orders.order_details", "order_details")
            .innerJoin("order_details.product", "products");

          // Add date filters if applicable
          if (startDate && endDateObj) {
            queryBuilder.where("orders.created_date BETWEEN :fromDate AND :endDate", {
              fromDate: startDate,
              endDate: endDateObj,
            });
          } else if (startDate) {
            queryBuilder.where("orders.created_date >= :fromDate", { fromDate: startDate });
          } else if (endDateObj) {
            queryBuilder.where("orders.created_date <= :endDate", { endDate: endDateObj });
          }

          queryBuilder.groupBy("products.title");

          const orderListData = await queryBuilder.getRawMany();

          const chartNumberPurchasesPlan = this.chartOrderPurchases.calculateNumberPurchasePlan(orderListData);
          return {
            data: chartNumberPurchasesPlan,
          };
        }
        case "number_purchases_plan_date": {
          const queryBuilder = this.orderProductDateChartRepository
            .createQueryBuilder("orders")
            .select("CONVERT(DATE, orders.created_date)", "orderDate") // Convert datetime to date
            .addSelect("products.title", "productTitle")
            .addSelect("SUM(order_details.quantity)", "totalQuantity")
            .innerJoin("orders.order_details", "order_details")
            .innerJoin("order_details.product", "products");

          // Apply date filtering
          if (fromDate && endDate) {
            queryBuilder.where("CONVERT(DATE, orders.created_date) BETWEEN :fromDate AND :endDate", {
              fromDate: startDate,
              endDate: endDateObj,
            });
          }

          queryBuilder.groupBy("CONVERT(DATE, orders.created_date), products.title"); // Group by date and product title
          queryBuilder.orderBy("CONVERT(DATE, orders.created_date)", "ASC"); // Order by date

          const orderListData = await queryBuilder.getRawMany();

          const chartPurchasePlanDate = this.chartOrderPurchasesDate.calculatePurchasePlanDate(orderListData, fromDate, endDate);
          return {
            data: chartPurchasePlanDate,
          };
        }

        case "number_purchases_sale_channel": {
          const queryBuilder = this.orderPurchaseSaleChannelsChartRepository
            .createQueryBuilder("orders")
            .innerJoin("orders.sale_channel", "sale_channel") // Join on the sale_channel relation
            .select("sale_channel.title", "saleChannelTitle") // Select the title of the sale channel
            .addSelect("COUNT(orders.id)", "totalOrders") // Count the number of orders for each sale channel
            .groupBy("sale_channel.title") // Group by sale channel title
            .orderBy("totalOrders", "DESC"); // Order by total orders in descending order

          if (fromDate && endDate) {
            queryBuilder.where("CONVERT(DATE, orders.created_date) BETWEEN :fromDate AND :endDate", {
              fromDate: startDate,
              endDate: endDateObj,
            });
          }

          // Execute the query
          const orderListData = await queryBuilder.getRawMany();
          console.log(orderListData);

          // Process the data using the service method
          const chartOrderPayment = this.chartOrderSaleChannelService.calculateOrderSaleChannel(orderListData);
          return {
            data: chartOrderPayment,
          };
        }
        default:
          throw new InternalServerErrorException({ code: -4, message: responseMessage.notFound });
      }
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
