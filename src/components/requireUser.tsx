import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getMeFn } from '../api/authApi';
import { useStateContext } from '../context';
import FullScreenLoader from './FullScreenLoader';

const RequireUser = ({ allowedRoles }: { allowedRoles: string[] }): JSX.Element => {
  const [cookies] = useCookies();
  const location = useLocation();
  const stateContext = useStateContext();

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

  return (Boolean(cookies.logged_in) || Boolean(user)) && allowedRoles.includes(user?.role as string) ? (
    <Outlet />
  ) : Boolean(cookies.logged_in) && Boolean(user) ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireUser;
