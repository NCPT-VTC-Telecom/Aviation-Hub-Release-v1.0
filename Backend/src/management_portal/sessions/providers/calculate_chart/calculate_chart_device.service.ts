import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { responseMessage } from "src/utils/constant";

@Injectable()
export class ChartDeviceHealthService {
  chartDeviceHealth(deviceHealtListData: any[]): any {
    try {
      // Initialize status counts
      const statusCounts = {
        Healthy: 0,
        Critical: 0,
        Problem: 0,
        Unknown: 0,
      };

      // Iterate through the device health list data to count statuses
      for (const device of deviceHealtListData) {
        const status = device.status;
        if (Object.prototype.hasOwnProperty.call(statusCounts, status)) {
          statusCounts[status]++;
        } else {
          statusCounts.Unknown++;
        }
      }

      // Structure the result
      const result = {
        categories: ["Healthy", "Critical", "Problem", "Unknown"],
        series: [
          {
            name: "Status",
            data: [statusCounts.Healthy, statusCounts.Critical, statusCounts.Problem, statusCounts.Unknown],
          },
        ],
      };

      return result;
    } catch (error) {
      // Handle the error properly
      throw new InternalServerErrorException(responseMessage.serviceError);
    }
  }
}
