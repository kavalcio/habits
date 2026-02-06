import { queryClient, supabase } from './supabase';

export const fetchHabits = {
  queryKey: ['habit'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('habit')
      .select()
      .eq('is_archived', false);
    if (error) throw error;
    return data ?? [];
  },
};

export const fetchArchivedHabits = {
  queryKey: ['archivedHabit'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('habit')
      .select()
      .eq('is_archived', true);
    if (error) throw error;
    return data ?? [];
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
    return data[0] ?? null;
  },
  enabled: !!habitId,
});

export const fetchHabitWithEvents = (habitId: number) => ({
  queryKey: ['habitWithEvents', { id: habitId }],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('habit')
      .select('*, event(*)')
      .eq('is_archived', false)
      .eq('id', habitId);
    if (error) throw error;
    return data[0] ?? null;
  },
  enabled: !!habitId,
});

export const fetchHabitsWithEvents = {
  queryKey: ['habitWithEvents'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('habit')
      // TODO: maybe add an optional date range for events here?
      .select('*, event(*)')
      .eq('is_archived', false);
    if (error) throw error;
    return data ?? [];
  },
};

export const createHabit = {
  mutationFn: async ({ name, color }: { name: string; color: string }) => {
    const { data, error } = await supabase
      .from('habit')
      .insert({ name, color })
      .select();
    if (error) throw error;
    return data[0] ?? null;
  },
  onSuccess: async () => {
    // TODO: try to update cache on success instead of invalidating it entirely
    // console.log('onSuccess', data);
    // const newHabit = data[0];
    // if (!newHabit) return;
    // queryClient.setQueryData(['habit', { id: newHabit.id }], newHabit);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['habit'] }),
      queryClient.invalidateQueries({ queryKey: ['habitWithEvents'] }),
    ]);
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
    return data[0] ?? null;
  },
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['habit'] }),
      queryClient.invalidateQueries({ queryKey: ['habitWithEvents'] }),
    ]);
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
    return data[0] ?? null;
  },
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['habit'] }),
      queryClient.invalidateQueries({ queryKey: ['habitWithEvents'] }),
      queryClient.invalidateQueries({ queryKey: ['archivedHabit'] }),
    ]);
  },
};

export const restoreHabit = {
  mutationFn: async (habitId: number) => {
    const { data, error } = await supabase
      .from('habit')
      .update({ is_archived: false })
      .eq('id', habitId)
      .select();
    if (error) throw error;
    return data[0] ?? null;
  },
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['habit'] }),
      queryClient.invalidateQueries({ queryKey: ['habitWithEvents'] }),
      queryClient.invalidateQueries({ queryKey: ['archivedHabit'] }),
    ]);
  },
};
