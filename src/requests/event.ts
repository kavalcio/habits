import { queryClient, supabase } from './supabase';

export const fetchEvents = (habitId: number) => ({
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

export const fetchEvent = (eventId: number) => ({
  queryKey: ['event', { id: eventId }],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('event')
      .select()
      .eq('id', eventId);
    if (error) throw error;
    return data[0];
  },
});

export const createEvent = {
  mutationFn: async ({ habitId, date }: { habitId: number; date: string }) => {
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
