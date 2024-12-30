import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ChartDataUsagePaxDateService {
  private categoryMappings: any;

  constructor(private configService: ConfigService) {
    // Define detailed mappings
    this.categoryMappings = {
      sessionCatalogs: {
        "Internet Browsing": "Internet Browsing",
        "Video Streaming": "Video Streaming",
        "Online Gaming": "Online Gaming",
        "Social Media": "Social Media",
        "Cloud Services": "Cloud Services",
        "Web Browsing": "Web Browsing",
        "Email Services": "Email Services",
        "Online Shopping": "Online Shopping",
        // Add more mappings if needed
      },
    };
  }

  chartPaxDataUsageSessionDate(sessionListData: any[], fromDate: string, endDate: string): any {
    try {
      const startDate = new Date(fromDate);
      const endDateObj = new Date(endDate);

      // Generate a list of dates from fromDate to endDate
      const categories = [];
      for (let dt = startDate; dt <= endDateObj; dt.setDate(dt.getDate() + 1)) {
        categories.push(new Date(dt).toISOString().slice(0, 10));
      }

      const categoryNames = Object.values(this.categoryMappings.sessionCatalogs);
      const series = categoryNames.map((category) => ({
        name: category,
        data: Array(categories.length).fill(0),
      }));

      // Create a map to store data for each date
      const dateDataMap = new Map<string, number[]>();

      // Iterate through the session list data
      sessionListData.forEach((session) => {
        const sessionDate = session.session_date; // Extract the date from query result
        const category = this.mapCategory(session);

        if (!dateDataMap.has(sessionDate)) {
          // Initialize data array for the date if it doesn't exist
          dateDataMap.set(sessionDate, Array(categoryNames.length).fill(0));
        }

        const categoryIndex = categoryNames.indexOf(category);
        const data = dateDataMap.get(sessionDate);
        if (categoryIndex !== -1) {
          // Increment data for the category on the date
          data[categoryIndex] += session.total_data_usage;
        }
      });

      // Populate the series data from the dateDataMap
      categories.forEach((date, dateIndex) => {
        const data = dateDataMap.get(date) || Array(categoryNames.length).fill(0);
        data.forEach((count, categoryIndex) => {
          series[categoryIndex].data[dateIndex] = count;
        });
      });

      return {
        categories: categories,
        series: series,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  private mapCategory(session: any): string {
    // Map session catalog names to categories
    if (session.session_catalog_name && this.categoryMappings.sessionCatalogs[session.session_catalog_name]) {
      return this.categoryMappings.sessionCatalogs[session.session_catalog_name];
    }

    // Default category
    return "Other content";
  }
}

@Injectable()
export class ChartDataUsagePerDateService {
  chartDataUsageDate(sessionListData: any[], fromDate: string, endDate: string): any {
    try {
      const categories = [];
      const durationData = new Map<string, number>();

      // Generate a list of dates from fromDate to endDate
      const startDate = new Date(fromDate);
      const endDateObj = new Date(endDate);
      for (let dt = startDate; dt <= endDateObj; dt.setDate(dt.getDate() + 1)) {
        const formattedDate = new Date(dt).toISOString().slice(0, 10);
        categories.push(formattedDate);
        durationData.set(formattedDate, 0); // Initialize to 0
      }

      // Populate the durationData map with the results from the query
      sessionListData.forEach((session) => {
        const sessionDate = session.session_date;
        const averageDuration = session.average_duration_hours || 0; // Handle missing data
        durationData.set(sessionDate, averageDuration);
      });

      // Prepare series data for output
      const seriesData = categories.map((date) => {
        return durationData.get(date) || 0; // Use 0 if no session data
      });

      return {
        categories: categories,
        series: [
          {
            name: "Thời lượng phiên trung bình (giờ)",
            data: seriesData,
          },
        ],
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  chartPaxSessionAveragePerDay(sessionListData: any[], fromDate: string, endDate: string): any {
    try {
      const startDate = new Date(fromDate);
      const endDateObj = new Date(endDate);

      // Generate a list of dates from fromDate to endDate
      const categories = [];
      for (let dt = startDate; dt <= endDateObj; dt.setDate(dt.getDate() + 1)) {
        categories.push(new Date(dt).toISOString().slice(0, 10));
      }

      // Initialize a map to store the count of sessions for each date
      const dateDataMap = new Map<string, number>();

      // Iterate through the session list data to populate session counts
      sessionListData.forEach((session) => {
        const sessionDate = session.session_date; // Use the formatted session_date from the query

        // Store session counts in the map
        dateDataMap.set(sessionDate, session.session_count);
      });

      // Populate the series data with the session counts
      const seriesData = categories.map((date) => dateDataMap.get(date) || 0); // Default to 0 for missing dates

      return {
        categories: categories,
        series: [
          {
            name: "Số phiên trung bình mỗi ngày",
            data: seriesData,
          },
        ],
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
