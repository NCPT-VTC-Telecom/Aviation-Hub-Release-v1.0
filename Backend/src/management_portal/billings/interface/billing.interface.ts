export interface BillingRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
}
export interface OrderInfoData {
  data: {
    id?: string;
    billingID?: string;
    paymentStatusId?: number;
    fulfillmentStatusId?: number;
    total?: number;
    totalQuantity?: number;
  };
}

export interface EditBillReq {
  data: {
    total?: number;
    totalQuantity?: number;
    statusId?: number;
  };
}
