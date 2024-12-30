import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChartDataUsagePaxService, ChartSessionBrowserService, ChartSessionDeviceService } from "../calculate_chart/calculate_chart.service";
import { ChartDataUsagePaxDateService, ChartDataUsagePerDateService } from "../calculate_chart/calculate_chart_date.service";
import { responseMessage } from "src/utils/constant";
import { LoggerService } from "../../../common/logger_service/providers/log_service/log_service.service";
import { BrowsersChart, DataUsageChart, DataUsageDateChart, DataUsagePaxDateServiceChart, PaxSessionAveragePerDayChart, UserDeviceChart } from "../../entity/session_chart.entity";
// import { InjectQueue } from "@nestjs/bull";
// import { Queue } from "bullmq";

@Injectable()
export class ChartSessionService {
  constructor(
    @InjectRepository(DataUsagePaxDateServiceChart)
    private readonly dataUsagePaxDateServiceChart: Repository<DataUsagePaxDateServiceChart>,

    @InjectRepository(BrowsersChart)
    private readonly browsersChartRepository: Repository<BrowsersChart>,

    @InjectRepository(DataUsageChart)
    private readonly dataUsageChartRepository: Repository<DataUsageChart>,

    @InjectRepository(UserDeviceChart)
    private readonly userDeviceChartRepository: Repository<UserDeviceChart>,

    @InjectRepository(DataUsageDateChart)
    private readonly dataUsageDateChartRepository: Repository<DataUsageDateChart>,

    @InjectRepository(PaxSessionAveragePerDayChart)
    private readonly paxSessionAveragePerDayChartRepository: Repository<PaxSessionAveragePerDayChart>,

    private readonly chartSessionBrowserService: ChartSessionBrowserService, // Inject the new service
    private readonly chartDataUsagePaxService: ChartDataUsagePaxService, // Inject the new service
    private readonly chartDataUsagePaxDateService: ChartDataUsagePaxDateService, // Inject the new service
    private readonly chartSessionDeviceService: ChartSessionDeviceService, // Inject the new service
    private readonly chartDataUsagePerDateService: ChartDataUsagePerDateService,
    private readonly logger: LoggerService
    // @InjectQueue("data-usage") private readonly dataUsageQueue: Queue // Inject the Bull queue
  ) {}

  async chartSessions(type: string, fromDate: string, endDate: string): Promise<any> {
    try {
      const startDate = new Date(fromDate);
      const endDateObj = new Date(endDate);

      startDate?.setHours(0, 0, 0, 0); // Start of the day
      endDateObj?.setHours(23, 59, 59, 999); // End of the day

      switch (type) {
        case "session_browser": {
          const queryBuilder = this.browsersChartRepository.createQueryBuilder("session_details");

          // Set date conditions

          // Add date filtering conditions only if needed
          if (fromDate && endDate) {
            queryBuilder.where("session_details.start_time BETWEEN :fromDate AND :endDate", {
              fromDate: startDate,
              endDate: endDateObj,
            });
          } else if (fromDate) {
            queryBuilder.where("session_details.start_time >= :fromDate", { fromDate: startDate });
          } else if (endDate) {
            queryBuilder.where("session_details.start_time <= :endDate", { endDate: endDateObj });
          }

          // Fetch user agents and their counts in one query
          const sessionListData = await queryBuilder.select(["session_details.user_agent"]).addSelect("COUNT(session_details.user_agent)", "count").groupBy("session_details.user_agent").getRawMany();

          const chartSessionBrowser = this.chartSessionBrowserService.calculateBrowserChart(sessionListData);

          return {
            data: chartSessionBrowser,
          };
        }
        case "total_pax_data_usage_session_name": {
          const queryBuilder = this.dataUsageChartRepository.createQueryBuilder("session_details").innerJoinAndSelect("session_details.session_catalog", "session_catalog");

          // Optimize the WHERE conditions with indexed columns
          if (startDate && endDateObj) {
            queryBuilder.where("session_details.start_time BETWEEN :fromDate AND :endDate", {
              fromDate: startDate,
              endDate: endDateObj,
            });
          } else if (startDate) {
            queryBuilder.where("session_details.start_time >= :fromDate", { fromDate: startDate });
          } else if (endDateObj) {
            queryBuilder.where("session_details.start_time <= :endDate", { endDate: endDateObj });
          }

          // Optimize select and group by with indexed columns
          const sessionListData = await queryBuilder
            .select(["SUM(session_details.data_usage_mb) AS total_data_usage", "session_catalog.name AS session_catalog_name"])
            .groupBy("session_catalog.name") // Group only by session catalog name
            .getRawMany();
          const chartDataUsagePax = this.chartDataUsagePaxService.calculateDataUsageChart(sessionListData);

          return {
            data: chartDataUsagePax,
          };
        }
        case "session_devices": {
          const queryBuilder = this.userDeviceChartRepository.createQueryBuilder("sessions");

          // Set date conditions

          // Add date filtering conditions only if needed
          if (fromDate && endDate) {
            queryBuilder.where("sessions.created_date BETWEEN :fromDate AND :endDate", {
              fromDate: startDate,
              endDate: endDateObj,
            });
          } else if (fromDate) {
            queryBuilder.where("sessions.created_date >= :fromDate", { fromDate: startDate });
          } else if (endDate) {
            queryBuilder.where("sessions.created_date <= :endDate", { endDate: endDateObj });
          }

          const sessionListData = await queryBuilder.select(["sessions.user_device"]).addSelect("COUNT(sessions.user_device)", "count").groupBy("sessions.user_device").getRawMany();

          const chartSessionDevices = this.chartSessionDeviceService.calculateDeviceUsage(sessionListData);
          return {
            data: chartSessionDevices,
          };
        }
        case "total_pax_data_usage_session_name_date": {
          const queryBuilder = this.dataUsagePaxDateServiceChart.createQueryBuilder("session_details").innerJoinAndSelect("session_details.session_catalog", "session_catalog");

          // Optimize the WHERE conditions with indexed columns
          if (startDate && endDateObj) {
            queryBuilder.where("session_details.start_time BETWEEN :fromDate AND :endDate", {
              fromDate: startDate,
              endDate: endDateObj,
            });
          } else if (startDate) {
            queryBuilder.where("session_details.start_time >= :fromDate", { fromDate: startDate });
          } else if (endDateObj) {
            queryBuilder.where("session_details.start_time <= :endDate", { endDate: endDateObj });
          }

          // Use CONVERT to extract date part in MSSQL
          const sessionListData = await queryBuilder
            .select([
              "CONVERT(VARCHAR, session_details.start_time, 23) AS session_date", // MSSQL format date to YYYY-MM-DD
              "SUM(session_details.data_usage_mb) AS total_data_usage",
              "session_catalog.name AS session_catalog_name",
            ])
            .groupBy("session_catalog.name, CONVERT(VARCHAR, session_details.start_time, 23)") // Group by session catalog name and formatted date
            .getRawMany();

          const chartDataUsageDatePax = this.chartDataUsagePaxDateService.chartPaxDataUsageSessionDate(sessionListData, fromDate, endDate);
          return {
            data: chartDataUsageDatePax,
          };
        }

        case "session_duration_average_date": {
          const queryBuilder = this.dataUsageDateChartRepository.createQueryBuilder("session_details");

          // Optimize the WHERE conditions with indexed columns
          if (startDate && endDateObj) {
            queryBuilder.where("session_details.start_time BETWEEN :fromDate AND :endDate", {
              fromDate: startDate,
              endDate: endDateObj,
            });
          } else if (startDate) {
            queryBuilder.where("session_details.start_time >= :fromDate", { fromDate: startDate });
          } else if (endDateObj) {
            queryBuilder.where("session_details.start_time <= :endDate", { endDate: endDateObj });
          }

          // Select the start and stop times to calculate session duration
          const sessionListData = await queryBuilder
            .select([
              "CONVERT(VARCHAR, session_details.start_time, 23) AS session_date", // Format date to YYYY-MM-DD
              "ROUND(AVG(DATEDIFF(MINUTE, session_details.start_time, session_details.stop_time)) / 60.0, 2) AS average_duration_hours", // Calculate average duration in hours and round to 2 decimal places
            ])
            .groupBy("CONVERT(VARCHAR, session_details.start_time, 23)") // Group by formatted date
            .getRawMany();

          // Pass session data to the chart service to format the data
          const chartDataUsagePerHour = this.chartDataUsagePerDateService.chartDataUsageDate(sessionListData, fromDate, endDate);

          return {
            data: chartDataUsagePerHour,
          };
        }
        case "session_per_date": {
          const queryBuilder = this.paxSessionAveragePerDayChartRepository.createQueryBuilder("session_details");

          // Optimize the WHERE conditions with indexed columns
          if (startDate && endDateObj) {
            queryBuilder.where("session_details.start_time BETWEEN :fromDate AND :endDate", {
              fromDate: startDate,
              endDate: endDateObj,
            });
          } else if (startDate) {
            queryBuilder.where("session_details.start_time >= :fromDate", { fromDate: startDate });
          } else if (endDateObj) {
            queryBuilder.where("session_details.start_time <= :endDate", { endDate: endDateObj });
          }

          // Select the start time to count sessions per day
          const sessionListData = await queryBuilder
            .select([
              "CONVERT(VARCHAR, session_details.start_time, 23) AS session_date", // Format date to YYYY-MM-DD
              "COUNT(*) AS session_count", // Count sessions for each date
            ])
            .groupBy("CONVERT(VARCHAR, session_details.start_time, 23)") // Group by formatted date
            .getRawMany();

          const chartDataUsagePerDate = this.chartDataUsagePerDateService.chartPaxSessionAveragePerDay(sessionListData, fromDate, endDate);
          return {
            data: chartDataUsagePerDate,
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
