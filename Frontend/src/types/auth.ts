import { ReactElement } from 'react';

// ==============================|| TYPES - AUTH  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  id: string;
  email?: string;
  avatar?: string;
  image?: string;
  name?: string;
  role?: string;
  tier?: string;
  fullname?: string;
  username?: string;
  phoneNumber?: string;
  address?: string;
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null;
  userLogged?: any;
  username?: string;
  userFound?: any;
  userSocial?: any;
  token?: string | null;
  // dataRoles: any[];
}

export interface AuthActionProps {
  type: string;
  payload?: AuthProps;
}

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
}

export interface JWTDataProps {
  userId: string;
}

export type JWTContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  username?: string;
  userFound?: any;
  logout: () => void;
  login: (username: string, password: string) => Promise<{ code: number }>;
  loginBySocial: (userGoogle: any) => Promise<{ code: number }>;
  register: (
    phoneNumber: string,
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean
  ) => Promise<{ code: number; message: string }>;
  resetPassword: (username: string, email: string, newPassword: string) => Promise<void>;
  verifyEmail: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};
