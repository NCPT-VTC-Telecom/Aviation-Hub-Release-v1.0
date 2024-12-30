import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { BrowsersChart, DataUsageChart } from "../../entity/session_chart.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Processor("data-usage")
export class DataUsageProcessor {
  constructor(
    @InjectRepository(DataUsageChart)
    private readonly dataUsageChartRepository: Repository<DataUsageChart>,

    @InjectRepository(BrowsersChart)
    private readonly BrowsersChartRepository: Repository<BrowsersChart>
  ) {}

  @Process("totalPaxDataUsageJob")
  async handleTotalPaxDataUsageJob(job: Job<any>) {
    const { startDate, endDateObj } = job.data;

    const queryBuilder = this.dataUsageChartRepository.createQueryBuilder("session_details").innerJoinAndSelect("session_details.session_catalog", "session_catalog");

    // Optimize the WHERE conditions
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

    const batchSize = 500; // Process in batches
    let offset = 0;
    let hasMoreData = true;

    // Optimize result handling by processing each batch independently
    while (hasMoreData) {
      const sessionListData = await queryBuilder
        .select(["SUM(session_details.data_usage_mb) AS total_data_usage", "session_details.domain", "session_details.url", "session_catalog.name", "COUNT(session_details.user_agent) AS count"])
        .groupBy("session_details.domain")
        .addGroupBy("session_details.url")
        .addGroupBy("session_catalog.name")
        .skip(offset) // Use skip for pagination
        .take(batchSize) // Use take for limiting batch size
        .getRawMany();

      if (sessionListData.length === 0) {
        hasMoreData = false;
      } else {
        // Process results within the loop to avoid storing large amounts of data
        sessionListData.forEach((result) => {
          console.log("Processing batch:", result);
        });

        offset += batchSize;
      }
    }

    console.log("Job completed");
  }

  //   @Process("sessionBrowsersJob")
  //   async handleSessionBrowsersJob(job: Job<any>) {
  //     const { startDate, endDateObj } = job.data;

  //     const queryBuilder = this.dataUsageChartRepository.createQueryBuilder("session_details").innerJoinAndSelect("session_details.session_catalog", "session_catalog");

  //     if (startDate && endDateObj) {
  //       queryBuilder.where("session_details.start_time BETWEEN :fromDate AND :endDate", {
  //         fromDate: startDate,
  //         endDate: endDateObj,
  //       });
  //     } else if (startDate) {
  //       queryBuilder.where("session_details.start_time >= :fromDate", { fromDate: startDate });
  //     } else if (endDateObj) {
  //       queryBuilder.where("session_details.start_time <= :endDate", { endDate: endDateObj });
  //     }

  //     const batchSize = 500; // Process in chunks of 500 records
  //     let offset = 0;
  //     let results = [];
  //     let hasMoreData = true;

  //     while (hasMoreData) {
  //       // Fetch data in chunks using limit and offset
  //       const sessionListData = await queryBuilder
  //         .select(["SUM(session_details.data_usage_mb) AS total_data_usage", "session_details.domain", "session_details.url", "session_catalog.name", "COUNT(session_details.user_agent) AS count"])
  //         .groupBy("session_details.domain")
  //         .addGroupBy("session_details.url")
  //         .addGroupBy("session_catalog.name")
  //         .limit(batchSize)
  //         .offset(offset)
  //         .getRawMany();

  //       if (sessionListData.length === 0) {
  //         hasMoreData = false;
  //       } else {
  //         results = results.concat(sessionListData); // Collect data
  //         offset += batchSize; // Move to the next batch
  //       }
  //     }

  //     console.log("Job completed", results);

  //     return results; // Return or store results
  //   }
}
