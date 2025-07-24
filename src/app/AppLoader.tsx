import { Box, ThemePanel } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';

import { Header } from '@/components';

import { AuthWrapper } from './AuthWrapper';

export const AppLoader = () => {
  return (
    <AuthWrapper>
      <Header />
      <Box m={{ initial: '4', sm: '6' }}>
        <Outlet />
      </Box>
      <ThemePanel />
    </AuthWrapper>
  );
};
