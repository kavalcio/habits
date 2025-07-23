import {
  Button,
  Container,
  Flex,
  Heading,
  TextField,
  Theme,
} from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { YearGrid } from '@/components';
import { Routes } from '@/constants';
import { deleteHabit, fetchEvents, fetchHabit, updateHabit } from '@/requests';

// TODO: add custom theme override on this page that uses the habit color
export const HabitOverview = () => {
  const navigate = useNavigate();
  const { habitId } = useParams();

  const { data, error, isPending } = useQuery(fetchHabit(habitId));
  const { data: events } = useQuery(fetchEvents(habitId));

  const habit = data?.[0];

  const [habitName, setHabitName] = useState<string>();
  const [habitColor, setHabitColor] = useState<string>();

  const updateHabitMutation = useMutation(updateHabit);
  const deleteHabitMutation = useMutation(deleteHabit);

  // TODO: improve error and loading states
  if (isPending) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!habit || !habitId) return <div>habit not found</div>;

  const onUpdateHabit = async () => {
    // TODO: validate inputs
    await updateHabitMutation.mutateAsync({
      id: habitId!,
      name: habitName!,
      color: habitColor!,
    });
  };

  const onDeleteHabit = async () => {
    await deleteHabitMutation.mutateAsync(habitId!);
    navigate(Routes.DASHBOARD, { replace: true });
  };

  return (
    <Theme accentColor="red">
      <Container>
        <Flex gap="2" direction="column">
          <Heading size="4">Habit: {habit.name}</Heading>
          <YearGrid habitId={habitId} events={events} />
          <TextField.Root
            placeholder="Habit Name"
            onChange={(e) => setHabitName(e.target.value)}
          />
          <input
            type="color"
            placeholder="habit color"
            onChange={(e) => setHabitColor(e.target.value)}
          />
          <Button
            variant="surface"
            onClick={onUpdateHabit}
            disabled={!habitName || !habitColor}
          >
            update habit
          </Button>
          <Button variant="soft" onClick={onDeleteHabit}>
            delete habit
          </Button>
        </Flex>
      </Container>
    </Theme>
  );
};
