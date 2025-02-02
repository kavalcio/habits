import {
  createBrowserRouter,
  Navigate,
  RouterProvider as ReactRouterDomProvider,
} from 'react-router-dom';
import { AppLoader } from 'src/app/AppLoader';

import { Routes } from '@/constants';

import { Dashboard, Login, Register } from '../pages';

// TODO: add error boundary
const router = createBrowserRouter([
  {
    path: Routes.ROOT,
    element: <AppLoader />,
    errorElement: <div>Error...</div>,
    children: [
      {
        index: true,
        element: <Navigate to={Routes.ROOT + window?.location?.search} />,
      },
      // {
      //   path: '*',
      //   element: <Navigate to={Routes.ROOT + window?.location?.search} />,
      // },
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
    ],
  },
]);

export const Router = () => <ReactRouterDomProvider router={router} />;
