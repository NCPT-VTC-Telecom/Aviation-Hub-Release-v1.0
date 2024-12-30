export interface BlackListRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
  type?: string;
}

export interface BlackListResponseWthMessage {
  code: number;
  message: string;
}

export interface BlackListResponseWthData {
  code: number;
  message: string;
  data?: unknown[];
}
