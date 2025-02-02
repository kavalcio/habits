import { queryClient, supabase } from './supabase';

export const fetchHabits = {
  queryKey: ['habit'],
  queryFn: async () => {
    const { data, error } = await supabase.from('habit').select();
    if (error) throw error;
    return data;
  },
};

export const fetchHabit = (id: string) => ({
  queryKey: ['habit', { id }],
  queryFn: async () => {
    const { data, error } = await supabase.from('habit').select().eq('id', id);
    if (error) throw error;
    return data;
  },
});

export const createHabit = {
  mutationFn: async ({ name, color }: { name: string; color: string }) => {
    const { data, error } = await supabase
      .from('habit')
      .insert({ name, color })
      .select();
    if (error) throw error;
    return data;
  },
  onSuccess: (data) => {
    // TODO: try to update cache on success instead of invalidating it entirely
    // console.log('onSuccess', data);
    // const newHabit = data[0];
    // if (!newHabit) return;
    // queryClient.setQueryData(['habit', { id: newHabit.id }], newHabit);
    queryClient.invalidateQueries({ queryKey: ['habit'] });
  },
};
