import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { getMeFn, authApi } from '../api/authApi';
import { useStateContext } from '../context';
import FullScreenLoader from '../components/FullScreenLoader';
import React from 'react';

interface AuthMiddlewareProps {
  children: React.ReactElement;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [cookies] = useCookies();
  const stateContext = useStateContext();

  // Add a request interceptor
  authApi.interceptors.request.use(function (config) {
    const token = cookies.access_token;
    if (token !== undefined) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  const query = useQuery(['authUser', cookies.user], async () => await getMeFn(cookies.user.id), {
    enabled: !!cookies.logged_in,
    onSuccess: (data) => {
      stateContext?.dispatch({ type: 'SET_USER', payload: data });
    },
  });

  if (query.isLoading && Boolean(cookies.logged_in)) {
    return <FullScreenLoader />;
  }

  return children;
};

export default AuthMiddleware;
