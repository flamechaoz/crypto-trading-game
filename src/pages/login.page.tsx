import Cookies from 'universal-cookie';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoadingButton as _LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { loginUserFn } from '../api/authApi';
import { useStateContext } from '../context';

const LoadingButton = styled(_LoadingButton)`
  padding: 0.6rem 0;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LinkItem = styled(Link)`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const loginSchema = object({
  email: string().min(1, 'Email address is required').email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

const cookies = new Cookies();

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state?.from.pathname as string) !== '' ? '/' : '';

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const stateContext = useStateContext();

  //  API Login Mutation
  const { mutate: loginUser, isLoading } = useMutation(async (userData: LoginInput) => await loginUserFn(userData), {
    onSuccess: (data) => {
      stateContext?.dispatch({ type: 'SET_USER', payload: data.user });
      cookies.set('logged_in', true);
      cookies.set('user', data.user);
      cookies.set('refresh_token', data.tokens.refresh.token, { expires: new Date(data.tokens.refresh.expires) });
      cookies.set('access_token', data.tokens.access.token, { expires: new Date(data.tokens.access.expires) });
      toast.success('You successfully logged in');
      navigate(from);
    },
    onError: (error: any) => {
      if (Array.isArray(error.response.data.error)) {
        error.response.data.error.forEach((el: any) =>
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

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    // ? Executing the loginUser Mutation
    loginUser(values);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          textAlign="center"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 2,
            letterSpacing: 1,
          }}
        >
          Welcome Back!
        </Typography>
        <Typography variant="body1" component="h2" sx={{ mb: 2 }}>
          Login to have access!
        </Typography>

        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            noValidate
            autoComplete="off"
            maxWidth="27rem"
            width="100%"
            sx={{
              p: { xs: '1rem', sm: '2rem' },
              borderRadius: 2,
            }}
          >
            <FormInput name="email" label="Email Address" type="email" />
            <FormInput name="password" label="Password" type="password" />

            <Typography sx={{ fontSize: '0.9rem', mb: '1rem', textAlign: 'right' }}>
              <LinkItem to="/">Forgot Password?</LinkItem>
            </Typography>

            <LoadingButton variant="contained" sx={{ mt: 1 }} fullWidth disableElevation type="submit" loading={isLoading}>
              Login
            </LoadingButton>

            <Typography sx={{ fontSize: '0.9rem', mt: '1rem' }}>
              Need an account? <LinkItem to="/register">Sign Up Here</LinkItem>
            </Typography>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
};

export default LoginPage;
