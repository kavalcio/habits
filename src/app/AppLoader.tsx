import { Outlet } from 'react-router-dom';

import { AuthWrapper } from './AuthWrapper';

export const AppLoader = () => {
  return (
    <AuthWrapper>
      <Outlet />
    </AuthWrapper>
  );
};
