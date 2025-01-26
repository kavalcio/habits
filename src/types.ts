export type Habit = {
  id: string; // hbt-asdf1234
  name: string;
  user: string;
  events: Event[];
  isArchived: boolean;
  color: string;
};

export type Event = {
  id: string; // evt-asdf1234
  date: string;
  habit: string;
  isCompleted: boolean;
};

export type User = {
  id: string; // usr-asdf1234
  name: string;
  email: string;
  habits: Habit[];
};

export type Schema = {
  users: User;
  habits: Habit;
  events: Event;
};
