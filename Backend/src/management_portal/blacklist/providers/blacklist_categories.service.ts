import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { LoggerService } from "src/management_portal/common/logger_service/providers/log_service/log_service.service";
import { BlackListCategoriesInfo } from "../entity/blacklist_categories.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { responseMessage } from "src/utils/constant";
import { BlackListCategorySyncRequestData } from "../interface/blacklist_categories.interface";

@Injectable()
export class BlackListCategoryService {
  constructor(
    @InjectRepository(BlackListCategoriesInfo)
    private readonly blackListCategoryInfoRepository: Repository<BlackListCategoriesInfo>,
    private readonly logger: LoggerService
  ) {}

  async findBlackListCategory(page: number, pageSize: number, filters: string): Promise<{ data: unknown[]; total: number; totalPages: number }> {
    page = Math.max(1, page);
    const skip = (page - 1) * pageSize;

    let queryBuilder = this.blackListCategoryInfoRepository.createQueryBuilder("blacklist_category").where("blacklist_category.status_id != :statusId", { statusId: 19 });

    if (filters) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("blacklist_category.code = :code", { code: filters }).orWhere("blacklist_category.name = :name", { name: filters });
        })
      );
    }
    const [blackListCategoryListData, total] = await queryBuilder.skip(skip).take(pageSize).getManyAndCount();
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: blackListCategoryListData.length > 0 ? blackListCategoryListData : [],
      total: total,
      totalPages,
    };
  }

  async handleAddBlackListCategory(dataAdd: BlackListCategorySyncRequestData): Promise<string> {
    const { name, code, description } = dataAdd.data;
    const existCategory = await this.blackListCategoryInfoRepository.findOne({ where: { code: code } });
    if (existCategory) {
      throw new ConflictException({ code: -1, message: responseMessage.existValue });
    }

    const newBlackListCategory = await this.blackListCategoryInfoRepository.create({
      code,
      description,
      name,
      status_id: 14,
    });

    await this.blackListCategoryInfoRepository.save(newBlackListCategory);
    return responseMessage.success;
  }

  async handleEditBlackListCategory(id: number, dataEdit: BlackListCategorySyncRequestData): Promise<string> {
    const { name, code, description } = dataEdit.data;
    const existCategory = await this.blackListCategoryInfoRepository.findOne({ where: { id } });
    if (!existCategory) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }

    await this.blackListCategoryInfoRepository.update(id, {
      code,
      description,
      name,
      modified_date: new Date(),
    });

    return responseMessage.success;
  }

  async handleDeleteBlackListCategory(id: number): Promise<string> {
    const existCategory = await this.blackListCategoryInfoRepository.findOne({ where: { id } });
    if (!existCategory) {
      throw new ConflictException({ code: -4, message: responseMessage.notFound });
    }
    await this.blackListCategoryInfoRepository.update(id, {
      status_id: 19,
      deleted_date: new Date(),
      modified_date: new Date(),
    });
    return responseMessage.success;
  }
}
