import { queryClient, supabase } from './supabase';

export const fetchHabits = {
  queryKey: ['habit'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('habit')
      .select()
      .eq('is_archived', false);
    if (error) throw error;
    return data;
  },
};

export const fetchHabit = (habitId: number) => ({
  queryKey: ['habit', { id: habitId }],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('habit')
      .select()
      .eq('is_archived', false)
      .eq('id', habitId);
    if (error) throw error;
    return data[0];
  },
  enabled: !!habitId,
});

export const createHabit = {
  mutationFn: async ({ name, color }: { name: string; color: string }) => {
    const { data, error } = await supabase
      .from('habit')
      .insert({ name, color })
      .select();
    if (error) throw error;
    return data[0];
  },
  onSuccess: () => {
    // TODO: try to update cache on success instead of invalidating it entirely
    // console.log('onSuccess', data);
    // const newHabit = data[0];
    // if (!newHabit) return;
    // queryClient.setQueryData(['habit', { id: newHabit.id }], newHabit);
    queryClient.invalidateQueries({ queryKey: ['habit'] });
  },
};

export const updateHabit = {
  mutationFn: async ({
    habitId,
    name,
    color,
  }: {
    habitId: number;
    name: string;
    color: string;
  }) => {
    const { data, error } = await supabase
      .from('habit')
      .update({ name, color })
      .eq('id', habitId)
      .select();
    if (error) throw error;
    return data[0];
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['habit'] });
  },
};

export const archiveHabit = {
  mutationFn: async (habitId: number) => {
    const { data, error } = await supabase
      .from('habit')
      .update({ is_archived: true })
      .eq('id', habitId)
      .select();
    if (error) throw error;
    return data[0];
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['habit'] });
  },
};
