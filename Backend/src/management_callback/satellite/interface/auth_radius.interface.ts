export interface ApiRadiusLogRequestData {
  requestBody?: string;
  requestHeaders?: string;
  username?: string;
  requestUrl?: string;
  responseMessage?: string;
  requestIpAddress?: string;
}

export interface LoginRadiusRequestData {
  username?: string;
  password?: string;
  NASIdentifier?: string;
  NASIPAddress?: string;
  framedIPAddress?: string;
  calledStationId?: string;
  serviceType?: string;
  callingStationId?: string;
}
