export interface EditTransactionReq {
  total?: number;
  subTotal?: number;
}

export interface TransactionRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
}
