export interface ManagementLoginRequestData {
  username: string;
  password: string;
}

export interface ManagementLoginOAUTHRequestData {
  email: string;
}

export interface ManagementLoginResponseData {
  user: {
    id: string;
    email: string;
    username: string;
  };
  accessToken: string;
}