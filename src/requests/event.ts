import { queryClient, supabase } from './supabase';

// TODO: need to type these responses properly
// TODO: allow fetching all events, not just for a specific habit?

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
  enabled: !!habitId,
});

export const fetchEvent = (id: string) => ({
  queryKey: ['event', { id }],
  queryFn: async () => {
    const { data, error } = await supabase.from('event').select().eq('id', id);
    if (error) throw error;
    return data[0];
  },
});

export const createEvent = {
  mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
    const { data, error } = await supabase
      .from('event')
      .insert({ habit_id: habitId, date })
      .select();
    if (error) throw error;
    return data[0];
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['event'] });
  },
};

export const deleteEvent = {
  mutationFn: async (eventId: number) => {
    const { error } = await supabase.from('event').delete().eq('id', eventId);
    if (error) throw error;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['event'] });
  },
};
