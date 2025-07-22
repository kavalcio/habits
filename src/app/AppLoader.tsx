import { Box } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';

import { AuthWrapper } from './AuthWrapper';

export const AppLoader = () => {
  return (
    <AuthWrapper>
      <Box m={{ initial: '4', sm: '6' }}>
        <Outlet />
      </Box>
    </AuthWrapper>
  );
};
