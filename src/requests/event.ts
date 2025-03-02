import { queryClient, supabase } from './supabase';

// TODO: allow fetching all events, not just for a specific habit?
// TODO: sort these in api or client?
export const fetchEvents = (habitId?: string) => ({
  queryKey: ['event', { habitId }],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('event')
      .select()
      .eq('habit_id', habitId);
    if (error) throw error;
    return data;
  },
});

export const fetchEvent = (id: string) => ({
  queryKey: ['event', { id }],
  queryFn: async () => {
    const { data, error } = await supabase.from('event').select().eq('id', id);
    if (error) throw error;
    return data;
  },
});

export const createEvent = {
  mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
    const { data, error } = await supabase
      .from('event')
      .insert({ habit_id: habitId, date })
      .select();
    if (error) throw error;
    return data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['event'] });
  },
};

export const deleteEvent = {
  mutationFn: async (id: string) => {
    const { data, error } = await supabase.from('event').delete().eq('id', id);
    if (error) throw error;
    return data;
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['event'] });
  },
};
