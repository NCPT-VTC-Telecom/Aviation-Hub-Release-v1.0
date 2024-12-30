export interface RadiusLoginRequestData {
  username: string;
  password: string;
  nasIdentifier: string;
  nasIPAddress: string;
  framedIPAddress: string;
  calledStationId: string;
  nasPortType: string;
  wiprsLogoffUrl: string;
  serviceType: string;
  ruckusSSID: string;
  messageAuthenticator: string;
}

export interface RadiusLoginResponseData {
  id: string;
  username: string;
  token: string;
  expireIn: string;
}
