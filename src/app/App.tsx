import { Theme } from '@radix-ui/themes';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/requests';
import { Router } from '@/router';

// TODO: pick a custom color palette using this: https://www.radix-ui.com/colors/custom
export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme
        appearance="dark"
        accentColor="grass"
        panelBackground="solid"
        radius="large"
      >
        <Router />
      </Theme>
    </QueryClientProvider>
  );
};
