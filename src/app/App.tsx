import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from '@/router';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <div className="App"> */}
      <Router />
      {/* </div> */}
    </QueryClientProvider>
  );
};
