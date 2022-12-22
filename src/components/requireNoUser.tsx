import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getMeFn } from '../api/authApi';
import { useStateContext } from '../context';
import FullScreenLoader from './FullScreenLoader';

const RequireNoUser = (): JSX.Element => {
  const [cookies] = useCookies();
  const location = useLocation();
  const stateContext = useStateContext();

  console.log('require no user');

  const {
    isLoading,
    isFetching,
    data: user,
  } = useQuery(['authUser', cookies.user], async () => await getMeFn(cookies.user.id), {
    retry: 1,
    onSuccess: (data) => {
      stateContext?.dispatch({ type: 'SET_USER', payload: data });
    },
  });

  const loading = isLoading || isFetching;

  if (loading) {
    return <FullScreenLoader />;
  }

  return cookies.logged_in === undefined || user == null ? (
    <Outlet />
  ) : (
    <Navigate to="/profile" state={{ from: location }} replace />
  );
};

export default RequireNoUser;
