import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuditLog } from "src/management_portal/common/logger_service/entity/log_user_management.entity";
import { Brackets, Repository } from "typeorm";
import { LoggerService } from "../log_service/log_service.service";
import { responseMessage } from "src/utils/constant";
@Injectable()
export class LogSystemService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly logger: LoggerService
  ) {}

  async findAuditLog(page: number, pageSize: number, filters: string, fromDate: Date, endDate: Date): Promise<any> {
    try {
      // Ensure page is at least 1
      page = Math.max(1, page);
      let queryBuilder = this.auditLogRepository.createQueryBuilder("audit").orderBy("audit.created_date", "DESC");

      if (filters) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where("audit.user_id = :userId", { userId: filters })
              .orWhere("audit.action_type = :actionType", { actionType: filters })
              .orWhere("audit.table_name = :tableName", { tableName: filters })
              .orWhere("audit.created_date >= :fromDate", { fromDate: new Date(fromDate) })
              .orWhere("audit.created_date <= :endDate", { endDate: new Date(endDate) });
          })
        );
      }

      const [audiLogData, total] = await queryBuilder
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);

      return {
        data: audiLogData.length > 0 ? audiLogData : [],
        total,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
