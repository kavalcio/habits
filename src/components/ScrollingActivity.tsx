import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Flex, Grid, IconButton, ScrollArea, Tooltip } from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addDays, addWeeks, format, startOfWeek, subWeeks } from 'date-fns';
import { useState } from 'react';

import { createEvent, deleteEvent, fetchHabitsWithEvents } from '@/requests';
import { Tables } from '@/types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const GRID_ITEM_SIZE = 32;
const GRID_GAP_SIZE = 8;
const TIME_WINDOW_DAYS = 14;

// TODO: can we stagger event data fetch, instead of fetching all at once?
// TODO: better format event/habit data to reduce time complexity
export const ScrollingActivity = () => {
  // Start with current week
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );
  const today = format(new Date(), 'yyyy-MM-dd');

  // Fetch all habits with their events for the user
  const { data: habitsWithEvents = [] } = useQuery(fetchHabitsWithEvents);
  console.log('habitsWithEvents', habitsWithEvents);

  const createEventMutation = useMutation(createEvent);
  const deleteEventMutation = useMutation(deleteEvent);

  return (
    <Flex direction="column" gap="5" maxWidth="100%">
      <Flex align="center" justify="between" mb="2">
        <IconButton
          onClick={() => setWeekStart(subWeeks(weekStart, 1))}
          variant="soft"
          aria-label="Previous week"
        >
          <ChevronLeftIcon />
        </IconButton>
        <span style={{ fontWeight: 500 }}>
          {format(weekStart, 'MMM d, yyyy')} -{' '}
          {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </span>
        <IconButton
          onClick={() => setWeekStart(addWeeks(weekStart, 1))}
          variant="soft"
          aria-label="Next week"
        >
          <ChevronRightIcon />
        </IconButton>
      </Flex>
      {habitsWithEvents.map(
        (habit: Tables<'habit'> & { events: Tables<'event'>[] }) => {
          const { events } = habit;
          const weekDates = Array.from({ length: TIME_WINDOW_DAYS }, (_, i) => {
            const dateObj = addDays(weekStart, i);
            const dateStr = format(dateObj, 'yyyy-MM-dd');
            const event = events?.find(
              (e: Tables<'event'>) => e.date === dateStr,
            );
            return {
              date: dateStr,
              formattedDate: format(dateObj, 'EEE, MMM d, yyyy'),
              completed: !!event,
              eventId: event?.id,
            };
          });
          const handleToggleEvent = async (dateData: (typeof weekDates)[0]) => {
            if (dateData.completed) {
              await deleteEventMutation.mutateAsync(dateData.eventId!);
            } else {
              await createEventMutation.mutateAsync({
                habitId: habit.id,
                date: dateData.date,
              });
            }
          };
          return (
            <Flex key={habit.id} direction="column" gap="2">
              <span style={{ fontWeight: 600, marginBottom: 4 }}>
                {habit?.name}
              </span>
              <ScrollArea scrollbars="horizontal" scrollHideDelay={600}>
                <Grid
                  columns={`${TIME_WINDOW_DAYS}`}
                  gap={`${GRID_GAP_SIZE}px`}
                  flow="row"
                  minWidth={`${GRID_ITEM_SIZE * TIME_WINDOW_DAYS + GRID_GAP_SIZE * (TIME_WINDOW_DAYS - 1)}px`}
                >
                  {weekDates.map((data, idx) => (
                    <Tooltip
                      key={data.date}
                      content={data.formattedDate}
                      delayDuration={300}
                    >
                      <IconButton
                        onClick={() => handleToggleEvent(data)}
                        variant={data.completed ? 'solid' : 'soft'}
                        {...(!data.completed && { color: 'gray' })}
                        style={{
                          width: `${GRID_ITEM_SIZE}px`,
                          height: `${GRID_ITEM_SIZE}px`,
                          borderRadius: 4,
                          border:
                            data.date === today
                              ? '2px solid var(--accent-9)'
                              : data.completed
                                ? 'none'
                                : '1px solid var(--gray-5)',
                          backgroundColor: data.completed
                            ? 'var(--accent-9)'
                            : 'var(--gray-2)',
                          color: data.completed ? 'white' : 'var(--gray-9)',
                          fontWeight: 600,
                        }}
                        aria-label={data.formattedDate}
                      >
                        {DAY_LABELS[idx % 7]}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Grid>
              </ScrollArea>
            </Flex>
          );
        },
      )}
    </Flex>
  );
};
