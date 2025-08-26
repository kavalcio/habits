import {
  createBrowserRouter,
  RouterProvider as ReactRouterDomProvider,
} from 'react-router-dom';
import { AppLoader } from 'src/app/AppLoader';

import { Routes } from '@/constants';

import { Dashboard, HabitOverview, Login, Profile, Register } from '../pages';

const router = createBrowserRouter([
  {
    path: Routes.ROOT,
    element: <AppLoader />,
    errorElement: <div>Error...</div>,
    children: [
      {
        path: Routes.ROOT,
        element: <div>Hello world</div>,
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
    ],
  },
]);

export const Router = () => <ReactRouterDomProvider router={router} />;
