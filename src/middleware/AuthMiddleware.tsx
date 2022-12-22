import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { getMeFn } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import FullScreenLoader from '../components/FullScreenLoader';
import React from 'react';

interface AuthMiddlewareProps {
  children: React.ReactElement;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const [cookies, setCookies, removeCookies] = useCookies();
  const stateContext = useStateContext();
  const navigate = useNavigate();

  const query = useQuery(['authUser', cookies.user], async () => await getMeFn(cookies.user.id), {
    enabled: !!cookies.logged_in,
    onSuccess: (data) => {
      stateContext?.dispatch({ type: 'SET_USER', payload: data });
    },
    onError: (error) => {
      console.log(error);
      const errMessage = error.response.data.message as string;
      if (errMessage.includes('Please re-login')) {
        removeCookies('logged_in');
        removeCookies('user');
        removeCookies('refresh_token');
        removeCookies('access_token');
        navigate('/login');
      }
    },
  });

  if (query.isLoading && Boolean(cookies.logged_in)) {
    return <FullScreenLoader />;
  }

  return children;
};

export default AuthMiddleware;
