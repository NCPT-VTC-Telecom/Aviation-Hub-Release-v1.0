import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderInformation, Transactions } from "src/management_portal/orders/entity/order.entity";
import { EditTransactionReq } from "src/management_portal/transactions/interface/transaction.interface";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepository: Repository<Transactions>,
    @InjectRepository(OrderInformation)
    private readonly orderInfoRepository: Repository<OrderInformation>,
    private readonly logger: LoggerService
  ) {}
  async findTransaction(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;

      const queryBuilder = this.transactionRepository.createQueryBuilder("transaction").leftJoinAndSelect("transaction.orders", "orders").orderBy("transaction.created_date", "DESC");
      const [transactionListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      if (!transactionListData || transactionListData.length === 0) {
        return {
          data: [],
          total: 0,
          totalPages: 0,
        };
      }

      const transactionData = transactionListData
        .map((item) => {
          if (!item) {
            return null;
          }
          const { orders, ...itemWithoutOrder } = item;
          if (!orders || Object.keys(orders).length === 0) {
            return { ...itemWithoutOrder, order_number: null };
          }
          const order_number = orders.order_number.length > 0 ? orders.order_number : null;
          return {
            ...itemWithoutOrder,
            order_number,
          };
        })
        .filter((item) => item !== null);

      const totalPages = Math.ceil(total / pageSize);
      return {
        data: transactionData.length > 0 ? transactionData : [],
        total: total,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddTransaction(total: number, subTotal: number): Promise<any> {
    try {
      // Create and save the new transaction entry
      const newTransaction = this.transactionRepository.create({
        subtotal: subTotal,
        total,
        status_id: 32,
        transaction_date: new Date(),
      });

      const addTransactionData = await this.transactionRepository.save(newTransaction);
      return {
        ...addTransactionData,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
  async handleCreateTransaction(id: string): Promise<any> {
    try {
      const existingOrder = await this.orderInfoRepository.findOne({ where: { id: id } });
      const { payment_status_id, fulfillment_status_id, total, subtotal } = existingOrder;
      if (existingOrder) {
        if (payment_status_id !== 1 || fulfillment_status_id !== 2) {
          // Xuất Transaction
          const newTransaction = await this.handleAddTransaction(total, subtotal);
          const idTransaction = newTransaction.id;
          // update thông tin order sua khi tạo Transaction mới
          const updateOrder = await this.orderInfoRepository.update(id, {
            transaction_id: idTransaction,
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

  async editTransaction(id: string, dataTransaction: EditTransactionReq): Promise<any> {
    try {
      const { total, subTotal } = dataTransaction;
      const existingTransaction = await this.transactionRepository.findOne({ where: { id: id } });
      if (!existingTransaction) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }
      await this.transactionRepository.update(id, {
        total,
        subtotal: subTotal,
        modified_date: new Date(),
      });

      await this.orderInfoRepository.update(
        { transaction_id: id },
        {
          total,
          subtotal: subTotal,
          modified_date: new Date(),
        }
      );
      const updateTransaction = await this.transactionRepository.findOne({ where: { id: id } });
      return updateTransaction;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
