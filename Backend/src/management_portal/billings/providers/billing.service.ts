import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EditBillDto } from "src/management_portal/billings/dto/billing.dto";
import { Billings, OrderInformation } from "src/management_portal/orders/entity/order.entity";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billings)
    private readonly billingsRepository: Repository<Billings>,
    @InjectRepository(OrderInformation)
    private readonly orderInfoRepository: Repository<OrderInformation>,
    private readonly logger: LoggerService
  ) {}
  async findBilling(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      const queryBuilder = this.billingsRepository.createQueryBuilder("billings").leftJoinAndSelect("billings.orders", "orders").orderBy("billings.created_date", "DESC");
      const [billListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();

      if (!billListData || billListData.length === 0) {
        return {
          data: [],
          total: 0,
          totalPages: 0,
        };
      }

      const billingData = billListData
        .map((item) => {
          if (!item) {
            return null;
          }
          const { orders, ...itemWithoutOrder } = item;
          if (!orders || Object.keys(orders).length === 0) {
            return { ...itemWithoutOrder, order_number: null };
          }
          const order_number = orders?.order_number.length > 0 ? orders.order_number : null;
          return {
            ...itemWithoutOrder,
            order_number,
          };
        })
        .filter((item) => item !== null);

      const totalPages = Math.ceil(total / pageSize);
      return {
        data: billingData.length > 0 ? billingData : [],
        total: total,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddBilling(total: number, totalQuantity: number): Promise<any> {
    try {
      // Fetch the current count of billing entries
      const count = await this.billingsRepository.count();

      // Generate a new billing number
      const newBillingNumber = this.generateBillingNumber(count + 1);

      // Create and save the new billing entry
      const newBilling = this.billingsRepository.create({
        billing_number: newBillingNumber,
        total,
        total_quantity: totalQuantity,
        status_id: 32,
        billing_date: new Date(),
      });

      const addBillingData = await this.billingsRepository.save(newBilling);

      return {
        ...addBillingData,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleCreateBill(id: string): Promise<any> {
    try {
      const existingOrder = await this.orderInfoRepository.findOne({ where: { id: id } });
      const { payment_status_id, fulfillment_status_id, total, total_quantity } = existingOrder;
      if (existingOrder) {
        // kiểm tra 2 trạng thái để xác thực quá trình in bill có fail không
        if (payment_status_id !== 1 || fulfillment_status_id !== 2) {
          // Xuất bill
          const newBill = await this.handleAddBilling(total, total_quantity);
          const idBilling = newBill.id;
          // update thông tin order sua khi tạo bill mới
          const updateOrder = await this.orderInfoRepository.update(id, {
            billing_id: idBilling,
            payment_status_id: 1,
            fulfillment_status_id: 2,
            modified_date: new Date(),
          });
          return updateOrder;
        }
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async editBilling(id: string, dataBill: EditBillDto): Promise<any> {
    try {
      const { total, totalQuantity } = dataBill;
      const existingBill = await this.billingsRepository.findOne({ where: { id: id } });
      if (!existingBill) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }
      await this.billingsRepository.update(id, {
        total,
        total_quantity: totalQuantity,
        modified_date: new Date(),
      });
      await this.orderInfoRepository.update(
        { billing_id: id },
        {
          total,
          total_quantity: totalQuantity,
          modified_date: new Date(),
        }
      );
      const updateBill = await this.billingsRepository.findOne({ where: { id: id } });
      return updateBill;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  private generateBillingNumber(count: number): string {
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const countString = count.toString().padStart(8, "0");
    return `${currentDate}${countString}`;
  }
}
