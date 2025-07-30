import { createClient } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';

import config from '@/config';
import { Database } from '@/types';

export const queryClient = new QueryClient();

export const supabase = createClient<Database>(
  config.SUPABASE_URL,
  config.SUPABASE_KEY,
);
