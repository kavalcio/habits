import { enqueueSnackbar } from 'notistack';

import { queryClient, supabase } from './supabase';

// TODO: type these functions with tanstack query types
// TODO: in the invalidateQueries calls, pass the specific id of the habit/event if relevant
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
  onSuccess: async () => {
    enqueueSnackbar('Event created', { variant: 'success' });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['event'] }),
      queryClient.invalidateQueries({ queryKey: ['habitWithEvents'] }),
    ]);
  },
};

export const deleteEvent = {
  mutationFn: async (eventId: number) => {
    const { error } = await supabase.from('event').delete().eq('id', eventId);
    if (error) throw error;
  },
  onSuccess: async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['event'] }),
      queryClient.invalidateQueries({ queryKey: ['habitWithEvents'] }),
    ]);
  },
};
