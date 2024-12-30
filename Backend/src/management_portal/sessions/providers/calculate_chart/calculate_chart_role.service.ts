import { Injectable } from "@nestjs/common";

@Injectable()
export class ChartSessionRoleService {
  calculateRoleChart(sessionListData: any[]): any {
    const roleDataMap = {};

    // Iterate through sessionListData to aggregate totalDataUsage by roleTitle
    sessionListData.forEach((session) => {
      const roleTitle = session.roleTitle || "Unknown Role"; // Handle null values if necessary
      const totalDataUsage = session.totalDataUsage || 0; // Handle null values if necessary

      if (!roleDataMap[roleTitle]) {
        roleDataMap[roleTitle] = 0;
      }

      roleDataMap[roleTitle] += totalDataUsage;
    });

    // Extract categories (role titles) and aggregated data (totalDataUsage)
    const categories = Object.keys(roleDataMap);
    const data = categories.map((roleTitle) => roleDataMap[roleTitle]);

    return {
      categories,
      series: [{ name: "PAX Data Usage", data }],
    };
  }
}

@Injectable()
export class ChartSessionRoleDateService {
  calculateRoleDateChart(sessionListData: any[], fromDate: string, endDate: string): any {
    const categories = this.getDateRange(fromDate, endDate);
    const series = [];

    const roleDataMap = {};

    sessionListData.forEach((item) => {
      const roleTitle = item.roleTitle || "Unknown Role"; // Handle null values if necessary
      const totalDataUsage = item.totalDataUsage || 0; // Handle null values if necessary
      const date = item.date || "Unknown Date"; // Handle null values if necessary

      // Initialize the role data if it doesn't exist in the map
      if (!roleDataMap[roleTitle]) {
        roleDataMap[roleTitle] = {
          name: roleTitle,
          data: Array(categories.length).fill(0),
        };
      }

      // Find the index of the date in categories
      const dataIndex = categories.indexOf(date);

      // If the date exists in the categories, add the totalDataUsage to the corresponding data point
      if (dataIndex !== -1) {
        roleDataMap[roleTitle].data[dataIndex] += totalDataUsage;
      }
    });

    // Convert roleDataMap values to an array (series)
    Object.values(roleDataMap).forEach((roleData) => {
      series.push(roleData);
    });

    return {
      categories,
      series,
    };
  }

  private getDateRange(fromDate: string, endDate: string): string[] {
    const dates = [];
    const startDate = new Date(fromDate);
    const endDateObj = new Date(endDate);

    // Loop through each date from startDate to endDateObj
    while (startDate <= endDateObj) {
      dates.push(startDate.toISOString().split("T")[0]);
      startDate.setDate(startDate.getDate() + 1);
    }

    return dates;
  }
}
