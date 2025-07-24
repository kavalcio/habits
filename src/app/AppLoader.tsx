import { Box, Theme, ThemePanel } from '@radix-ui/themes';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '@/components';

import { AuthWrapper } from './AuthWrapper';

export const AppLoader = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <AuthWrapper>
      <Theme
        appearance={isDarkMode ? 'dark' : 'light'}
        accentColor="grass"
        panelBackground="solid"
        radius="large"
      >
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Box m={{ initial: '4', sm: '6' }}>
          <Outlet />
        </Box>
        <ThemePanel />
      </Theme>
    </AuthWrapper>
  );
};
