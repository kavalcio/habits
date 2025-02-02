import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/requests';
import { Router } from '@/router';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <div className="App"> */}
      <Router />
      {/* </div> */}
    </QueryClientProvider>
  );
};
