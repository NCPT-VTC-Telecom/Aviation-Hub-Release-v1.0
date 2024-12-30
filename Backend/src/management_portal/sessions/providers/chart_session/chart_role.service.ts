import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { responseMessage } from "src/utils/constant";
import { Repository } from "typeorm";
import { ChartSessionRoleDateService, ChartSessionRoleService } from "../calculate_chart/calculate_chart_role.service";
import { LoggerService } from "../../../common/logger_service/providers/log_service/log_service.service";
import { SessionDataRoleChart } from "../../entity/session_role_chart.entity";

@Injectable()
export class ChartRoleService {
  constructor(
    @InjectRepository(SessionDataRoleChart)
    private readonly sessionsRepository: Repository<SessionDataRoleChart>,

    private readonly chartSessionRoleService: ChartSessionRoleService,
    private readonly chartSessionRoleDateService: ChartSessionRoleDateService,
    private readonly logger: LoggerService
  ) {}

  async chartRole(type: string, fromDate?: string, endDate?: string): Promise<any> {
    try {
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;

      if (startDate) startDate.setHours(0, 0, 0, 0); // Set start to 00:00:00
      if (endDateObj) endDateObj.setHours(23, 59, 59, 999); // Set end to 23:59:59

      switch (type) {
        case "total_data_usage_role": {
          // Query for total data usage by role
          const queryBuilder = this.sessionsRepository
            .createQueryBuilder("sessions")
            .leftJoin("sessions.user", "user")
            .leftJoin("user.user_groups", "userGroup")
            .leftJoin("userGroup.group_role", "groupRole")
            .select(["groupRole.title AS roleTitle", "SUM(sessions.total_data_usage) AS totalDataUsage"])
            .groupBy("groupRole.title");

          const sessionListData = await queryBuilder.getRawMany();

          const chartData = this.chartSessionRoleService.calculateRoleChart(sessionListData);
          return { data: chartData };
        }

        case "total_data_usage_role_date": {
          // Query for total data usage by role and date
          const queryBuilder = this.sessionsRepository
            .createQueryBuilder("sessions")
            .leftJoin("sessions.flight", "flight")
            .leftJoin("sessions.user", "user")
            .leftJoin("user.user_groups", "userGroup")
            .leftJoin("userGroup.group_role", "groupRole")
            // Using CONVERT to extract the date part in SQL Server
            .select(["groupRole.title AS roleTitle", "SUM(sessions.total_data_usage) AS totalDataUsage", "CONVERT(VARCHAR, sessions.created_date, 23) AS date"]);

          if (startDate && endDateObj) {
            queryBuilder
              .groupBy("groupRole.title")
              .addGroupBy("CONVERT(VARCHAR, sessions.created_date, 23)") // Grouping by extracted date
              .where("sessions.created_date >= :fromDate AND sessions.created_date <= :endDate", { fromDate: startDate, endDate: endDateObj });
          } else {
            queryBuilder.groupBy("groupRole.title");
          }

          const sessionListData = await queryBuilder.getRawMany();

          const chartData = this.chartSessionRoleDateService.calculateRoleDateChart(sessionListData, fromDate, endDate);
          return { data: chartData };
        }

        default:
          throw new InternalServerErrorException({ code: -4, message: responseMessage.notFound });
      }
    } catch (error) {
      console.error(error);
      this.logger.error(responseMessage.serviceError, error);
      throw new InternalServerErrorException({ code: -5, message: responseMessage.serviceError });
    }
  }
}
