export interface SessionRequestData {
  page?: number;
  pageSize?: number;
  filters?: string;
}

export interface SessionChartRequestData {
  type?: string;
  fromDate?: string;
  endDate?: string;
}

export interface TotalDataSes {
  flightId?: number;
  startDate?: Date;
  endDate?: Date;
}
