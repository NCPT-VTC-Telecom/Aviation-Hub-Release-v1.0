import { Injectable } from "@nestjs/common";

@Injectable()
export class ChartOrderPurchasesService {
  calculateNumberPurchasePlan(orderListData: any[]): any {
    const categories = orderListData.map((order) => order.productTitle);
    const data = orderListData.map((order) => +order.totalQuantity); // Ensure the values are numbers

    return {
      categories: categories,
      series: [
        {
          name: "Plan",
          data: data,
        },
      ],
    };
  }
}

@Injectable()
export class ChartOrderSaleChannelService {
  calculateOrderSaleChannel(orderListData: any[]): any {
    // Extract categories and data from the query result
    const categories = orderListData.map((order) => order.saleChannelTitle);
    const data = orderListData.map((order) => parseInt(order.totalOrders, 10));

    // Return the formatted data for the chart
    return {
      categories: categories,
      series: [
        {
          name: "Sale Channel",
          data: data,
        },
      ],
    };
  }
}
