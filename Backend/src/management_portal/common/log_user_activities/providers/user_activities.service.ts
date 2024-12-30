import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuditLog, LogUserActivities } from "src/management_portal/common/logger_service/entity/log_user_management.entity";
import { AuditLogRequestData, UserActivitiesRequestData } from "src/management_portal/common/log_user_activities/interface/user_activities.interface";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import { LoggerService } from "../../logger_service/providers/log_service/log_service.service";

@Injectable()
export class DatabaseLogService {
  constructor(
    @InjectRepository(LogUserActivities)
    private readonly userActivitiesRepository: Repository<LogUserActivities>,

    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly logger: LoggerService
  ) {}

  async handleUserActivities(type: string, requestData: UserActivitiesRequestData): Promise<any> {
    try {
      const { userId, accessToken, ipAddress, userAgent } = requestData;
      const existActivities = await this.userActivitiesRepository.findOne({ where: { user_id: userId } });
      if (existActivities) {
        const updatedUserActivities = await this.userActivitiesRepository.update(
          { user_id: userId },
          {
            last_time: existActivities?.access_time,
            access_time: new Date(),
            access_token: accessToken,
            ipaddress: ipAddress,
            login_count: Number(existActivities?.login_count) + 1,
            user_agent: userAgent,
            type: type,
            modified_date: new Date(),
          }
        );
        return updatedUserActivities;
      } else {
        const newUserActivities = this.userActivitiesRepository.create({
          user_id: userId,
          access_time: new Date(),
          access_token: accessToken,
          ipaddress: ipAddress,
          user_agent: userAgent,
          last_time: new Date(),
          login_count: 1,
          type: type,
        });

        const addUserActivities = await this.userActivitiesRepository.save(newUserActivities);
        return addUserActivities;
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }

  async handleSaveAuditLog(actionType: string, requestData: AuditLogRequestData): Promise<any> {
    try {
      const { ipAddress, newData, oldData, requestContent, tableName, userAgent, userId, responseContent } = requestData;

      const auditLogInsert = this.auditLogRepository.create({
        user_id: userId,
        action_type: actionType,
        ipaddress: ipAddress,
        action_time: new Date(),
        new_data: newData,
        old_data: oldData,
        request_content: requestContent,
        table_name: tableName,
        user_agent: userAgent,
        response_content: responseContent,
      });

      return await this.auditLogRepository.save(auditLogInsert);
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
