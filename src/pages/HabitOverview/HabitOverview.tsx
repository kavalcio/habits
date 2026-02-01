import { Pencil1Icon } from '@radix-ui/react-icons';
import {
  Callout,
  Container,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  Theme,
} from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import {
  AddEditHabitDialog,
  EventCalendar,
  FormError,
  YearGrid,
} from '@/components';
import { fetchEvents, fetchHabit } from '@/requests';

// TODO: add custom theme override on this page that uses the habit color
export const HabitOverview = () => {
  const params = useParams();

  // TODO: check for if habitId is a valid number
  const habitId = Number(params.habitId);

  const { data: habit, error, isPending } = useQuery(fetchHabit(habitId));
  const { data: events } = useQuery(fetchEvents(habitId));

  if (isPending) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 300 }}>
        <Spinner size="3" />
      </Flex>
    );
  }
  if (error) {
    return (
      <Container size="1">
        <FormError message="Error loading habit" />
      </Container>
    );
  }
  if (!habit || !habitId || isNaN(habitId)) {
    return (
      <Container size="1">
        <Callout.Root color="gray">
          <Callout.Icon />
          <Callout.Text>
            <Text color="gray">
              The habit you are looking for does not exist.
            </Text>
          </Callout.Text>
        </Callout.Root>
      </Container>
    );
  }

  return (
    <Theme
    // accentColor="red"
    >
      <Container size="3">
        <Flex gap="4" direction="column">
          <Flex width="100%" align="center" gap="3">
            <Heading size="4">{habit.name}</Heading>
            <AddEditHabitDialog habit={habit}>
              <Dialog.Trigger>
                <IconButton size="1" variant="ghost">
                  <Pencil1Icon />
                </IconButton>
              </Dialog.Trigger>
            </AddEditHabitDialog>
          </Flex>
          <YearGrid habitId={habitId} events={events} />
          <EventCalendar habitId={habitId} events={events} />
        </Flex>
      </Container>
    </Theme>
  );
};
