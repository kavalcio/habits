import {
  Cross2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import {
  Button,
  Checkbox,
  ChevronDownIcon,
  Dialog,
  Flex,
  IconButton,
  Popover,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

import { createEvent, deleteEvent, fetchHabits } from '@/requests';

import { Calendar } from './Calendar';

// TODO: add placeholder components when loading
export const DailyLogDialog = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [habitSearchQuery, setHabitSearchQuery] = useState('');

  const { data: habits, error, isPending } = useQuery(fetchHabits);

  const createEventMutation = useMutation(createEvent);
  const deleteEventMutation = useMutation(deleteEvent);

  const onToggleEvent = async ({
    eventId,
    habitId,
  }: {
    eventId?: number;
    habitId: number;
  }) => {
    try {
      if (eventId) {
        await deleteEventMutation.mutateAsync(eventId);
      } else {
        await createEventMutation.mutateAsync({
          habitId,
          date: selectedDate,
        });
      }
    } catch (error) {
      console.error('Error toggling event:', error);
    }
  };

  const filteredHabits = useMemo(() => {
    if (!habits) return [];
    return habits.filter((habit) =>
      habit.name.toLowerCase().includes(habitSearchQuery.toLowerCase()),
    );
  }, [habits, habitSearchQuery]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline">
          <PlusIcon />
          <Text>Log Event</Text>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="500px" minHeight="500px">
        <Dialog.Title>Log Event</Dialog.Title>
        <Flex direction="column" gap="4" align="baseline">
          <Popover.Root open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <Popover.Trigger>
              <Button variant="outline">
                {format(new Date(selectedDate), 'MMM dd, yyyy')}
                <ChevronDownIcon />
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <Calendar
                defaultInitialDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
              />
            </Popover.Content>
          </Popover.Root>
          <TextField.Root
            placeholder="Search"
            value={habitSearchQuery}
            onChange={(e) => setHabitSearchQuery(e.target.value)}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
            {habitSearchQuery && (
              <TextField.Slot>
                <IconButton
                  variant="ghost"
                  size="1"
                  onClick={() => setHabitSearchQuery('')}
                >
                  <Cross2Icon />
                </IconButton>
              </TextField.Slot>
            )}
          </TextField.Root>
          <Flex direction="column" gap="2" width="100%">
            {filteredHabits.map((habit) => (
              <Button
                key={habit.id}
                variant="outline"
                style={{
                  height: 'auto',
                  padding: '20px',
                  justifyContent: 'flex-start',
                }}
              >
                <div
                  style={{
                    backgroundColor: habit.color,
                    minWidth: 20,
                    minHeight: 20,
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                />
                <Text align="left">{habit.name}</Text>
                <Checkbox ml="auto" size="3" checked={false} />
              </Button>
            ))}
            {filteredHabits.length === 0 && (
              <Text size="2">No habits found</Text>
            )}
          </Flex>
          <Flex width="100%" justify="end" gap="2" mt="auto">
            <Dialog.Close>
              <Button variant="soft">Done</Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
