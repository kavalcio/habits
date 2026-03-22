import {
  createBrowserRouter,
  RouterProvider as ReactRouterDomProvider,
} from 'react-router-dom';
import { AppLoader } from 'src/app/AppLoader';

import { Routes } from '@/constants';

import {
  Dashboard,
  ForgotPassword,
  HabitOverview,
  Home,
  Login,
  NotFound,
  Profile,
  Register,
  ResetPassword,
} from '../pages';

import { RouteErrorPage } from './RouteErrorPage';

const router = createBrowserRouter([
  {
    path: Routes.ROOT,
    element: <AppLoader />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: Routes.ROOT,
        element: <Home />,
      },
      {
        path: Routes.LOGIN,
        element: <Login />,
      },
      {
        path: Routes.REGISTER,
        element: <Register />,
      },
      {
        path: Routes.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: Routes.RESET_PASSWORD,
        element: <ResetPassword />,
      },
      {
        path: Routes.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: Routes.HABIT_OVERVIEW,
        element: <HabitOverview />,
      },
      {
        path: Routes.PROFILE,
        element: <Profile />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export const Router = () => <ReactRouterDomProvider router={router} />;
