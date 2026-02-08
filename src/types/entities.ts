import { Tables } from './supabase';

export type Event = Tables<'event'> & { event_tag: Tables<'event_tag'>[] };

export type Habit = Tables<'habit'> & { habit_tag: Tables<'habit_tag'>[] };

export type HabitWithEvents = Habit & {
  event: Event[];
};
