import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataUsageChart } from "../../entity/session_chart.entity";

@Injectable()
export class ChartSessionBrowserService {
  calculateBrowserChart(sessionListData: any[]): any {
    // Extract categories and counts from the query results
    const categories = sessionListData.map((sessionDetail) => sessionDetail.session_details_user_agent || "Unknown");
    const data = sessionListData.map((sessionDetail) => parseInt(sessionDetail.count, 10)); // Convert count to a number

    return {
      categories,
      series: [
        {
          name: "Browser",
          data: data,
        },
      ],
    };
  }
}

// interface Session {
//   domain?: string;
//   url?: string;
//   session_catalog?: { name: string };
//   data_usage_mb: number;
// }

interface CategoryMappings {
  sessionCatalogs: Record<string, string>;
}

@Injectable()
export class ChartDataUsagePaxService {
  private categoryMappings: { sessionCatalogs: Map<string, string> };
  private categories: Set<string>;

  constructor(private configService: ConfigService) {
    this.initializeMappings();
    // Create a unified set of categories, including "Other content"
    this.categories = new Set([...this.categoryMappings.sessionCatalogs.values(), "Other content"]);
  }

  private initializeMappings() {
    // Load mappings from external source or configuration
    const rawMappings = this.configService.get<CategoryMappings>("categoryMappings", {
      sessionCatalogs: {
        "Internet Browsing": "Internet Browsing",
        "Video Streaming": "Video Streaming",
        "Online Gaming": "Online Gaming",
        "Social Media": "Social Media",
        "Cloud Services": "Cloud Services",
        "Web Browsing": "Web Browsing",
        "Email Services": "Email Services",
        "Online Shopping": "Online Shopping",
      },
    });

    // Convert raw mappings to Maps for faster lookup
    this.categoryMappings = {
      sessionCatalogs: new Map(Object.entries(rawMappings.sessionCatalogs)),
    };
  }

  public calculateDataUsageChart(sessionListData: any[]): { categories: string[]; series: { name: string; data: number[] }[] } {
    // Use reduce to aggregate data usage by category
    const categoryDataUsage = sessionListData.reduce(
      (acc, session) => {
        const category = this.categoryMappings.sessionCatalogs.get(session.session_catalog_name) || "Other content"; // Use session catalog name directly
        acc[category] = (acc[category] || 0) + parseFloat(session.total_data_usage); // Use the aggregated data_usage
        return acc;
      },
      {} as Record<string, number>
    );

    // Format the result for chart consumption
    const categories = Array.from(this.categories);
    const data = categories.map((category) => categoryDataUsage[category] || 0);

    return {
      categories,
      series: [
        {
          name: "PAX Data Usage",
          data,
        },
      ],
    };
  }
}

@Injectable()
export class ChartSessionDeviceService {
  calculateDeviceUsage(sessions: any[]): any {
    const deviceCategories = ["Android", "IOS", "Ipad", "Laptop", "Windows", "MacOS", "Ubuntu", "Linux", "Others", "Unknown"];
    const deviceDataUsage: Record<string, number> = {};

    // Initialize all device categories to 0
    deviceCategories.forEach((category) => {
      deviceDataUsage[category] = 0;
    });

    console.log(sessions);

    // Aggregate usage based on session data
    sessions.forEach((session) => {
      const device = session.sessions_user_device || "Unknown"; // Use "Unknown" for null or undefined devices

      // Map "Macbook" to "MacOS" if necessary
      const normalizedDevice = device === "Macbook" ? "MacOS" : device;

      // Aggregate the count
      if (deviceDataUsage.hasOwnProperty(normalizedDevice)) {
        deviceDataUsage[normalizedDevice] += session.count; // Use count from session
      } else {
        deviceDataUsage["Unknown"] += session.count; // Increment "Unknown" for unmapped devices
      }
    });

    // Prepare the data for chart consumption
    const data = deviceCategories.map((category) => deviceDataUsage[category]);

    return {
      categories: deviceCategories, // Return all categories
      series: [
        {
          name: "Device",
          data: data,
        },
      ],
    };
  }
}
