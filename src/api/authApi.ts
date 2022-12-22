import axios from 'axios';
import Cookies from 'universal-cookie';
import { LoginInput } from '../pages/login.page';
import { RegisterInput } from '../pages/register.page';
import { ITokens, IAuthResponse, IUser } from './types';
const BASE_URL = 'http://localhost:3001/v1/';

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const cookies = new Cookies();
const refreshToken = cookies.get('refresh_token');

authApi.defaults.headers.common['Content-Type'] = 'application/json';

export const refreshAccessTokenFn = async (myRefreshToken: string): Promise<ITokens> => {
  const response = await authApi.post<ITokens>('auth/refresh-tokens', { refreshToken: myRefreshToken });
  return response.data;
};

authApi.interceptors.request.use(function (config) {
  const accessToken = cookies.get('access_token');
  console.log('intercep req');
  if (accessToken !== undefined) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message as string;
    if (errMessage.includes('authenticate') && !originalRequest._retry && refreshToken !== undefined) {
      originalRequest._retry = true;
      const tokens = await refreshAccessTokenFn(refreshToken);
      cookies.set('refresh_token', tokens.refresh.token, { expires: new Date(tokens.refresh.expires) });
      cookies.set('access_token', tokens.access.token, { expires: new Date(tokens.access.expires) });
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
