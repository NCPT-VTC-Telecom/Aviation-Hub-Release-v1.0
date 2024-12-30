export interface GetDiscountRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
}

export interface DataDiscountRequest {
  data: DiscountRequestData;
}

export interface DiscountRequestData {
  name?: string;
  quantity?: number;
  quantityPerUser?: number;
  dateFrom?: Date;
  dateEnd?: Date;
  minimal?: number;
  maximal?: number;
  code?: string;
  type?: string;
}
