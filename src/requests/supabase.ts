import { createClient } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';

import config from '@/config';

export const queryClient = new QueryClient();

export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
