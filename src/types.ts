export type Habit = {
  id: string;
  userId: string;
  name: string;
  color: string;
  isArchived: boolean;
};

export type Event = {
  id: string;
  habitId: string;
  date: string;
};
