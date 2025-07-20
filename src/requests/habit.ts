import { queryClient, supabase } from './supabase';

// TODO: camelcase keys in response

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

export const updateHabit = {
  mutationFn: async ({
    id,
    name,
    color,
  }: {
    id: string;
    name: string;
    color: string;
  }) => {
    const { data, error } = await supabase
      .from('habit')
      .update({ name, color })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['habit'] });
  },
};

export const deleteHabit = {
  mutationFn: async (id: string) => {
    const { error } = await supabase.from('habit').delete().eq('id', id);
    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['habit'] });
  },
};
