import { queryClient, supabase } from './supabase';

export const createHabitTag = {
  mutationFn: async ({ habitId, name }: { habitId: number; name: string }) => {
    const { data, error } = await supabase
      .from('habit_tag')
      .insert({ habit_id: habitId, name })
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
