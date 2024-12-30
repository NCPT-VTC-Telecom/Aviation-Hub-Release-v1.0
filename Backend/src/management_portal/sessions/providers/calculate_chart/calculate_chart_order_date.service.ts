import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class ChartOrderPurchasesDateService {
  calculatePurchasePlanDate(orderListData: any[], fromDate: string, endDate: string): any {
    try {
      const startDate = new Date(fromDate);
      const endDateObj = new Date(endDate);
      // Generate a list of dates from fromDate to endDate
      const categories: string[] = [];
      for (let dt = new Date(startDate); dt <= endDateObj; dt.setDate(dt.getDate() + 1)) {
        categories.push(new Date(dt).toISOString().slice(0, 10));
      }

      // Create a map to store the count of each product for each date
      const productDataMap: { [productName: string]: { [date: string]: number } } = {};

      orderListData.forEach((order) => {
        const orderDate = new Date(order.created_date).toISOString().slice(0, 10);
        order.order_details.forEach((detail: { product: { title: any }; quantity: number }) => {
          const productName = detail?.product?.title;

          if (!productDataMap[productName]) {
            productDataMap[productName] = {};
          }

          if (!productDataMap[productName][orderDate]) {
            productDataMap[productName][orderDate] = 0;
          }

          productDataMap[productName][orderDate] += detail?.quantity;
        });
      });

      // Convert the product data map to the series format
      const series = Object.keys(productDataMap).map((productName) => {
        const data = categories.map((date) => productDataMap[productName][date] || 0);
        return {
          name: productName,
          data: data,
        };
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
}
