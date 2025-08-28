import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import {
  Button,
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

import { createEvent, deleteEvent, fetchHabitsWithEvents } from '@/requests';
import { Tables } from '@/types';
import { getLocalDate } from '@/utils';

import { Calendar } from './Calendar';

// TODO: add placeholder components when loading
export const DailyLogDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline">
          <PlusIcon />
          <Text>Log Event</Text>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="500px" minHeight="500px">
        <DailyLogDialogContent />
      </Dialog.Content>
    </Dialog.Root>
  );
};

const DailyLogDialogContent = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [habitSearchQuery, setHabitSearchQuery] = useState('');

  const { data: habits } = useQuery(fetchHabitsWithEvents);
  const habitsWithDateIndexedEvents = useMemo(() => {
    return habits?.map((habit) => ({
      ...habit,
      event: habit.event.reduce(
        (acc, event) => {
          acc[event.date] = event;
          return acc;
        },
        {} as Record<string, Tables<'event'>>,
      ),
    }));
  }, [habits]);

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
    if (!habitsWithDateIndexedEvents) return [];
    return habitsWithDateIndexedEvents.filter((habit) =>
      habit.name.toLowerCase().includes(habitSearchQuery.toLowerCase()),
    );
  }, [habitsWithDateIndexedEvents, habitSearchQuery]);

  const onDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  console.log({
    selectedDate,
    dateObject: new Date(selectedDate),
    noTimezone: new Date(selectedDate).toISOString(),
    formatted: format(new Date(selectedDate), 'MMM dd, yyyy'),
    localDate: getLocalDate(selectedDate),
    formlocal: format(getLocalDate(selectedDate), 'MMM dd, yyyy'),
  });

  const selectedDateLabel = useMemo(() => {
    const dayOfWeek = format(getLocalDate(selectedDate), 'EEE');
    if (selectedDate === format(new Date(), 'yyyy-MM-dd')) {
      return `Today (${dayOfWeek})`;
    }
    if (
      selectedDate ===
      format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
    ) {
      return `Yesterday (${dayOfWeek})`;
    }
    return format(getLocalDate(selectedDate), 'EEE, MMM dd, yyyy');
  }, [selectedDate]);

  return (
    <>
      <Dialog.Title>Log Event</Dialog.Title>
      <Flex direction="column" gap="4" align="baseline">
        <Flex gap="1" mx="auto">
          <IconButton
            variant="outline"
            onClick={() => {
              const prevDate = getLocalDate(selectedDate);
              prevDate.setDate(prevDate.getDate() - 1);
              setSelectedDate(format(prevDate, 'yyyy-MM-dd'));
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Popover.Root open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <Popover.Trigger>
              <Button variant="outline" style={{ width: 180 }}>
                {selectedDateLabel}
                <ChevronDownIcon style={{ marginLeft: 'auto' }} />
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <Calendar
                defaultInitialDate={selectedDate}
                onDateSelect={onDateSelect}
                onReturnToToday={onDateSelect}
              />
            </Popover.Content>
          </Popover.Root>
          <IconButton
            variant="outline"
            onClick={() => {
              // Shift to the next day
              const nextDate = getLocalDate(selectedDate);
              nextDate.setDate(nextDate.getDate() + 1);
              setSelectedDate(format(nextDate, 'yyyy-MM-dd'));
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Flex>
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
              variant={habit.event[selectedDate] ? 'solid' : 'outline'}
              style={{
                height: 'auto',
                padding: '20px',
                justifyContent: 'flex-start',
              }}
              onClick={() =>
                onToggleEvent({
                  eventId: habit.event[selectedDate]?.id,
                  habitId: habit.id,
                })
              }
            >
              <div
                style={{
                  backgroundColor: habit.color,
                  minWidth: 20,
                  // height: '100%',
                  minHeight: 20,
                  borderRadius: 4,
                  marginRight: 10,
                }}
              />
              <Text align="left">{habit.name}</Text>
              <Flex
                style={{
                  marginLeft: 'auto',
                  minHeight: 25,
                  minWidth: 25,
                  borderRadius: 4,
                  border: '2px solid var(--white-a4)',
                }}
              >
                {habit.event[selectedDate] && (
                  <CheckIcon
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                  />
                )}
              </Flex>
            </Button>
          ))}
          {filteredHabits.length === 0 && <Text size="2">No habits found</Text>}
        </Flex>
        <Flex width="100%" justify="end" gap="2" mt="auto">
          <Dialog.Close>
            <Button variant="soft">Done</Button>
          </Dialog.Close>
        </Flex>
      </Flex>
    </>
  );
};
