import { Button, Text, TextField } from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Event } from 'src/types';

import { Routes } from '@/constants';
import {
  createEvent,
  deleteHabit,
  fetchEvents,
  fetchHabit,
  updateHabit,
} from '@/requests';

export const HabitOverview = () => {
  const navigate = useNavigate();
  const { habitId } = useParams();

  const { data, error, isPending } = useQuery(fetchHabit(habitId));
  const { data: events, isPending: isEventsPending } = useQuery(
    fetchEvents(habitId),
  );

  const habit = data?.[0];
  console.log(data);

  const [habitName, setHabitName] = useState<string>();
  const [habitColor, setHabitColor] = useState<string>();
  const [eventDate, setEventDate] = useState<string>();

  const updateHabitMutation = useMutation(updateHabit);
  const deleteHabitMutation = useMutation(deleteHabit);
  const createEventMutation = useMutation(createEvent);

  if (isPending) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!habit) return <div>habit not found</div>;

  const onUpdateHabit = async () => {
    await updateHabitMutation.mutateAsync({
      id: habitId!,
      name: habitName,
      color: habitColor,
    });
  };

  const onDeleteHabit = async () => {
    await deleteHabitMutation.mutateAsync(habitId!);
    // Navigate to dashboard, but replace
    navigate(Routes.DASHBOARD, { replace: true });
  };

  const onCreateEvent = async () => {
    if (!eventDate) return;
    await createEventMutation.mutateAsync({
      habitId: habitId!,
      date: eventDate,
    });
  };

  console.log(eventDate);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Text>{habit.name}</Text>
      <TextField.Root
        placeholder="Habit Name"
        onChange={(e) => setHabitName(e.target.value)}
      />
      <input
        type="color"
        placeholder="habit color"
        onChange={(e) => setHabitColor(e.target.value)}
      />
      <Button variant="surface" onClick={onUpdateHabit}>
        update habit
      </Button>
      <Button variant="soft" onClick={onDeleteHabit}>
        delete habit
      </Button>
      <span style={{ marginTop: 20 }}>new event</span>
      <input
        placeholder="event date"
        type="date"
        onChange={(e) => setEventDate(e.target.value)}
      />
      <Button variant="ghost" onClick={onCreateEvent}>
        create event
      </Button>
      {events?.map((event: Event) => (
        <div key={event.id}>
          <span>{event.date}</span>
        </div>
      ))}
    </div>
  );
};
