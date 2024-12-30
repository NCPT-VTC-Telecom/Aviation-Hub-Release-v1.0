export interface CallBackLogRequestData {
  requestUrl?: string;
  requestMethod?: string;
  requestData?: string;
  requestTimeUTC?: Date;
  requestContentType?: string;
  requestIpAddress?: string;
  requestUserAgent?: string;
  responseStatusCode?: string;
  responseContent?: string;
  responseTimeUTC?: Date;
  responseIpAddress?: string;
}
