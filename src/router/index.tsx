/* eslint-disable react/display-name */
import { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import FullScreenLoader from '../components/FullScreenLoader';
import Layout from '../components/Layout';
import RequireUser from '../components/requireUser';
import RequireNoUser from '../components/requireNoUser';
import HomePage from '../pages/home.page';
import ProfilePage from '../pages/profile.page';
import TradePage from '../pages/trade.page';

const Loadable = (Component: React.ComponentType<any>) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<FullScreenLoader />}>
      <Component {...props} />
    </Suspense>
  );

const RegisterPage = Loadable(lazy(async () => await import('../pages/register.page')));
const LoginPage = Loadable(lazy(async () => await import('../pages/login.page')));
const UnauthorizePage = Loadable(lazy(async () => await import('../pages/unauthorize.page')));
const EmailVerificationPage = Loadable(lazy(async () => await import('../pages/verifyemail.page')));

const authRoutes: RouteObject = {
  path: '*',
  children: [
    {
      path: 'login',
      element: <RequireNoUser />,
      children: [
        {
          path: '',
          element: <LoginPage />,
        },
      ],
    },
    {
      path: 'register',
      element: <RequireNoUser />,
      children: [
        {
          path: '',
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: 'verifyemail',
      element: <EmailVerificationPage />,
      children: [
        {
          path: ':verificationCode',
          element: <EmailVerificationPage />,
        },
      ],
    },
  ],
};

const normalRoutes: RouteObject = {
  path: '*',
  element: <Layout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: 'profile',
      element: <RequireUser allowedRoles={['user', 'admin']} />,
      children: [
        {
          path: '',
          element: <ProfilePage />,
        },
      ],
    },
    {
      path: 'trade',
      element: <RequireUser allowedRoles={['user', 'admin']} />,
      children: [
        {
          path: '',
          element: <TradePage />,
        },
      ],
    },
    {
      path: 'unauthorized',
      element: <UnauthorizePage />,
    },
  ],
};

const routes: RouteObject[] = [authRoutes, normalRoutes];

export default routes;
