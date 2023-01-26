export interface IUser {
  data: any;
  role: string;
  isEmailVerified: boolean;
  name: string;
  email: string;
  id: string;
}

export interface ITokens {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}

export interface IAuthResponse {
  user: IUser;
  tokens: ITokens;
}

export interface IGenericResponse {
  status: string;
  message: string;
}

export interface ILoginResponse {
  status: string;
  access_token: string;
}

export interface IUserResponse {
  status: string;
  data: {
    user: IUser;
  };
}

export interface IWalletBalance {
  id: string;
  wallet: string;
  balance: number;
  currency: string;
}

export interface IWallet {
  id: string;
  userID: string;
  walletBalances: IWalletBalance[];
}
