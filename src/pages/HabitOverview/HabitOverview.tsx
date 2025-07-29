import { Pencil1Icon } from '@radix-ui/react-icons';
import {
  Container,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Theme,
} from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { AddEditHabitDialog, YearGrid } from '@/components';
import { fetchEvents, fetchHabit } from '@/requests';

// TODO: add custom theme override on this page that uses the habit color
export const HabitOverview = () => {
  const { habitId } = useParams();

  const { data: habit, error, isPending } = useQuery(fetchHabit(habitId));
  const { data: events } = useQuery(fetchEvents(habitId));

  // TODO: improve error and loading states
  if (isPending) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!habit || !habitId) return <div>habit not found</div>;

  return (
    <Theme accentColor="red">
      <Container>
        <Flex gap="2" direction="column">
          <Flex width="100%" align="center" gap="3">
            <Heading size="4">Habit: {habit.name}</Heading>
            <AddEditHabitDialog habit={habit}>
              <Dialog.Trigger>
                <IconButton size="1" variant="ghost">
                  <Pencil1Icon />
                </IconButton>
              </Dialog.Trigger>
            </AddEditHabitDialog>
          </Flex>
          <YearGrid habitId={habitId} events={events} />
        </Flex>
      </Container>
    </Theme>
  );
};
