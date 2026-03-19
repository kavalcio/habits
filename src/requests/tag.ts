import { enqueueSnackbar } from 'notistack';

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
    enqueueSnackbar('Tag created', { variant: 'success' });
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['habit'] }),
      queryClient.invalidateQueries({ queryKey: ['habitWithEvents'] }),
    ]);
  },
};

export const addTagsToEvent = {
  mutationFn: async ({
    eventId,
    habitTagIds,
  }: {
    eventId: number;
    habitTagIds: number[];
  }) => {
    const { data, error } = await supabase
      .from('event_tag')
      .insert(
        habitTagIds.map((habitTagId) => ({
          event_id: eventId,
          habit_tag_id: habitTagId,
        })),
      )
      .select();
    if (error) throw error;
    return data ?? null;
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['habitWithEvents'] });
  },
};

export const removeTagsFromEvent = {
  mutationFn: async ({ eventTagIds }: { eventTagIds: number[] }) => {
    const { data, error } = await supabase
      .from('event_tag')
      .delete()
      .in('id', eventTagIds)
      .select();
    if (error) throw error;
    return data ?? null;
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['habitWithEvents'] });
  },
};
