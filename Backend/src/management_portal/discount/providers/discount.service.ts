import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { generateUniqueCode } from "src/utils/common";
import { responseMessage } from "src/utils/constant";
import { Brackets, Repository } from "typeorm";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { Discount } from "../entity/discount.entity";
import { DataDiscountRequest, DiscountRequestData } from "../interface/discount.interface";

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    private readonly logger: LoggerService
  ) {}

  async findDiscount(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      const skip = (page - 1) * pageSize;
      const queryBuilder = this.discountRepository.createQueryBuilder("discount").where("discount.status_id != :status_id", { status_id: 13 }).orderBy("discount.created_date", "DESC");
      if (filters) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("discount.type = :filters", { filters: filters })
              .orWhere("discount.name LIKE :filters", { filters: `%${filters}%` })
              .orWhere("discount.code LIKE :filters", { filters: `%${filters}%` });
          })
        );
      }
      const [discountListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
      const totalPages = Math.ceil(total / pageSize);

      return {
        data: discountListData.length > 0 ? discountListData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async addDiscount(dataDiscount: DataDiscountRequest): Promise<any> {
    try {
      const { name, quantity, quantityPerUser, dateFrom, dateEnd, minimal, maximal, type } = dataDiscount.data;
      let discountCode = generateUniqueCode(6);
      let newCodeDiscount = `VTC${discountCode}`;
      let exitsDiscount = await this.discountRepository.findOne({ where: { code: newCodeDiscount } });
      const exitsDiscountName = await this.discountRepository.findOne({ where: { name } });
      if (exitsDiscountName) {
        throw new ConflictException({ code: -1, message: "Tên Discount đã tồn tại" });
      }
      while (exitsDiscount) {
        discountCode = generateUniqueCode(6);
        newCodeDiscount = `VTC${discountCode}`;
        exitsDiscount = await this.discountRepository.findOne({ where: { code: newCodeDiscount } });
      }
      const newDiscount = this.discountRepository.create({
        name,
        code: newCodeDiscount,
        quantity,
        quantity_per_user: quantityPerUser,
        date_from: dateFrom,
        date_end: dateEnd,
        minimal,
        maximal,
        type,
        status_id: 14,
      });
      const addNewDiscount = await this.discountRepository.save(newDiscount);
      return addNewDiscount;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async editDiscount(id: number, dataDiscount: DataDiscountRequest): Promise<any> {
    const { name, quantity, quantityPerUser, dateFrom, dateEnd, minimal, maximal, type } = dataDiscount.data;

    try {
      const existingDiscount = await this.discountRepository.findOne({ where: { id } });
      if (!existingDiscount) {
        throw new ConflictException({ code: -4, message: responseMessage.notFound });
      }
      await this.discountRepository.update(id, {
        name,
        date_from: dateFrom,
        date_end: dateEnd,
        quantity,
        quantity_per_user: quantityPerUser,
        maximal,
        minimal,
        type,
      });
      const updatedDiscount = await this.discountRepository.findOne({ where: { id } });
      return updatedDiscount;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async deleteDiscount(id: number): Promise<any> {
    try {
      const existingDiscount = await this.discountRepository.findOne({ where: { id } });
      if (!existingDiscount) {
        throw new ConflictException({
          code: -4,
          message: responseMessage.notFound,
        });
      }
      // Change Status
      await this.discountRepository.update(id, {
        status_id: 13,
        deleted_date: new Date(),
      });
    } catch (error) {
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
