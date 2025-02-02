import { queryClient, supabase } from './supabase';

export const fetchHabits = {
  queryKey: ['habit'],
  queryFn: async () => {
    const { data, error } = await supabase.from('habit').select();
    if (error) {
      throw error;
    }
    return data;
  },
};

export const createHabit = {
  mutationFn: async ({ name, color }: { name: string; color: string }) => {
    const { data, error } = await supabase
      .from('habit')
      .insert({ name, color });
    if (error) {
      throw error;
    }
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['habit'] });
  },
};
