export interface RegisterManagementRequestData {
  fullname: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface LogoutRequestData {
  token?: string;
}

export interface ResetPasswordData {
  username?: string;
  email?: string;
  newPassword?: string;
}

export interface ChangePasswordData {
  username?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
}
