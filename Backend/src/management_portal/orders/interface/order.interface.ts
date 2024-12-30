export interface OrderRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequestData {
  data: {
    idUser?: string;
    idSaleChannel?: number;
    idGateway?: number;
    idFlight?: number;
    itemList?: Array<CreateOrderItem>;
    subtotal?: number;
    totalQuantity?: number;
    totalDiscount?: number;
    total?: number;
    taxFee?: number;
    shippingMethod?: string;
    note?: string;
  };
}

export interface TotalRevenue {
  flightNumber?: number;
  startDate?: Date;
  endDate?: Date;
}
