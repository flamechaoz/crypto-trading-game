import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingButton as _LoadingButton } from '@mui/lab';
import { useStateContext } from '../context';
import { useMutation } from 'react-query';
import { logoutUserFn } from '../api/authApi';
import { useCookies } from 'react-cookie';

const LoadingButton = styled(_LoadingButton)`
  padding: 0.4rem;
  color: #222;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Header = (): JSX.Element => {
  const navigate = useNavigate();
  const stateContext = useStateContext();
  const user = stateContext?.state.authUser;
  const [cookies, setCookie, removeCookie] = useCookies();

  const { mutate: logoutUser, isLoading } = useMutation(async (refreshToken: string) => await logoutUserFn(refreshToken), {
    onSuccess: (data) => {
      removeCookie('logged_in');
      removeCookie('user');
      removeCookie('refresh_token');
      removeCookie('access_token');
      removeCookie('user');
      window.location.href = '/login';
    },
    onError: (error: any) => {
      if (Array.isArray(error.response.data.error)) {
        error.data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          })
        );
      } else {
        toast.error(error.response.data.message, {
          position: 'top-right',
        });
      }
    },
  });

  const onLogoutHandler = (): void => {
    logoutUser(cookies.refresh_token);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" onClick={() => navigate('/')} sx={{ cursor: 'pointer', color: '#222' }}>
              CodevoWeb
            </Typography>
            <Box display="flex" sx={{ ml: 'auto' }}>
              {user == null && (
                <>
                  <LoadingButton sx={{ mr: 2 }} onClick={() => navigate('/register')}>
                    SignUp
                  </LoadingButton>
                  <LoadingButton onClick={() => navigate('/login')}>Login</LoadingButton>
                </>
              )}
              {user != null && (
                <>
                  <LoadingButton loading={isLoading} onClick={() => navigate('/profile')}>
                    Profile
                  </LoadingButton>
                  <LoadingButton onClick={onLogoutHandler} loading={isLoading}>
                    Logout
                  </LoadingButton>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
