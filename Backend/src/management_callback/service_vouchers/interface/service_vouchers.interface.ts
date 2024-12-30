export interface ServiceVoucherData {
  endDate?: Date;
  productId?: number;
  type?: string;
}

export interface GetDataList {
  page?: number;
  pageSize?: number;
  filters?: string;
}

export interface VerifyVoucher {
  voucherCode?: string;
  requestId?: string;
}

export interface QueryVoucher {
  id: string;
}

export interface ChangeStatusVoucher {
  status: string;
}
