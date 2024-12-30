import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { responseMessage } from "src/utils/constant";
import { LoggerService } from "../../common/logger_service/providers/log_service/log_service.service";
import { SaleChannels } from "../entity/sale_channels.entity";
import { DataRequestSaleChannels } from "../interface/sale_channels.interface";

@Injectable()
export class SalesChannelService {
  constructor(
    @InjectRepository(SaleChannels)
    private readonly saleChannelsRepository: Repository<SaleChannels>,
    private readonly logger: LoggerService
  ) {}

  async findSaleChannels(page: number, pageSize: number, filters: string): Promise<any> {
    try {
      page = Math.max(1, page);
      let queryBuilder = this.saleChannelsRepository.createQueryBuilder("sale_channels").where("sale_channels.status_id != :statusId", { statusId: 13 }).orderBy("sale_channels.created_date", "DESC");

      if (filters) {
        // Apply the filter to multiple fields using OR operator
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("sale_channels.code LIKE :filters", { filters: `%${filters}%` })
              .orWhere("sale_channels.title LIKE :filters", { filters: `%${filters}%` })
              .orWhere("sale_channels.value LIKE :filters", { filters: `%${filters}%` });
          })
        );
      }
      const [saleChannelsListData, total] = await queryBuilder
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      return {
        data: saleChannelsListData.length > 0 ? saleChannelsListData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleAddSaleChannel(dataSaleChannels: DataRequestSaleChannels): Promise<any> {
    const { title, description, code, value } = dataSaleChannels;

    const existSaleChannels = await this.saleChannelsRepository.findOne({ where: { code: code, status_id: 14 } });

    if (existSaleChannels) {
      throw new ConflictException({ code: -1, message: "Kênh bán hàng này đã tồn tại" });
    }

    try {
      const newSaleChannels = this.saleChannelsRepository.create({
        title,
        description,
        code,
        value,
        status_id: 14,
      });
      await this.saleChannelsRepository.save(newSaleChannels);

      return newSaleChannels;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      if (error instanceof ConflictException) {
        throw error; // Re-throw the ConflictException with its specific message
      } else {
        throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
      }
    }
  }

  async handleEditSaleChannels(id: number, dataSaleChannels: DataRequestSaleChannels): Promise<any> {
    const { title, description, code, value } = dataSaleChannels;

    const existSaleChannel = await this.saleChannelsRepository.findOne({ where: { id, status_id: 14 } });

    if (!existSaleChannel) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }

    try {
      await this.saleChannelsRepository.update(id, {
        title,
        description,
        code,
        value,
        modified_date: new Date(),
      });

      const updatedSaleChannels = await this.saleChannelsRepository.findOne({ where: { code } });
      return updatedSaleChannels;
    } catch (error) {
      console.log(error);
      this.logger.error(responseMessage.serviceError, error);
      if (error instanceof ConflictException) {
        throw error; // Re-throw the ConflictException with its specific message
      } else {
        throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
      }
    }
  }

  async handleDeleteSaleChannels(id: number): Promise<any> {
    try {
      // Check if the Sale Channels exists
      const existingSaleChannels = await this.saleChannelsRepository.findOne({ where: { id } });
      if (!existingSaleChannels) {
        throw new ConflictException({
          code: -4,
          message: responseMessage.notFound,
        });
      }
      // Change Status
      await this.saleChannelsRepository.update(id, {
        status_id: 13,
        modified_date: new Date(),
        deleted_date: new Date(),
      });
      return existingSaleChannels;
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      if (error instanceof ConflictException) {
        throw error; // Re-throw the ConflictException with its specific message
      } else {
        throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
      }
    }
  }
}
