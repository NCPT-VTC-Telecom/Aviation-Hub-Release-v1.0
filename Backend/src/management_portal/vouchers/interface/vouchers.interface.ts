export interface VouchersRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
}

export interface VoucherInfoData {
  fromDate?: Date;
  endDate?: Date;
  productId?: number;
  userId?: string;
}

export interface MultiVoucherData {
  data: VoucherInfoData[];
}

export interface ListProduct {
  productId?: number;
  quantity?: number;
}

export interface AddMultiVoucher {
  userId?: string;
  campaignId: string;
  startDate?: Date;
  endDate?: Date;
  data?: ListProduct[];
}
