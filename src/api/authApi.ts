import axios from 'axios';
import { LoginInput } from '../pages/login.page';
import { RegisterInput } from '../pages/register.page';
import { ITokens, IAuthResponse, IUser } from './types';
const BASE_URL = 'http://localhost:3001/v1/';

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common['Content-Type'] = 'application/json';

export const refreshAccessTokenFn = async (myRefreshToken: string): Promise<ITokens> => {
  const response = await authApi.post<ITokens>('auth/refresh-tokens', { refreshToken: myRefreshToken });
  return response.data;
};

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    if (errMessage.includes('authenticate') && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessTokenFn();
      return await authApi(originalRequest);
    }
    return await Promise.reject(error);
  }
);

export const signUpUserFn = async (user: RegisterInput): Promise<IAuthResponse> => {
  const response = await authApi.post<IAuthResponse>('auth/register', user);
  return response.data;
};

export const loginUserFn = async (user: LoginInput): Promise<IAuthResponse> => {
  const response = await authApi.post<IAuthResponse>('auth/login', user);
  return response.data;
};

export const verifyEmailFn = async (verificationCode: string): Promise<void> => {
  await authApi.post<null>(`auth/verify-email?token=${verificationCode}`);
};

export const logoutUserFn = async (myRefreshToken: string): Promise<void> => {
  await authApi.post<null>('auth/logout', { refreshToken: myRefreshToken });
};

export const getMeFn = async (userID: string): Promise<IUser> => {
  const response = await authApi.get<IUser>(`users/${userID}`);
  return response.data;
};
