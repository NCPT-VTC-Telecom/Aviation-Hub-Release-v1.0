export interface AirlineInfo {
  name?: string;
  description?: string;
  code?: string;
  country?: string;
  email?: string;
  phoneNumber?: string;
}

export interface AirlinesReq {
  data: AirlineInfo;
}



export interface AirlineReqData {
  page?: number;
  pageSize?: number;
  filters?: string;
}

export interface AirlineResData {
  code?: number;
  message?: string;
  data?: unknown[];
  total?: number;
  totalPages?: number;
}
