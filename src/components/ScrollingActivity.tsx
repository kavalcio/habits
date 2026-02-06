import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ResetIcon,
} from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  IconButton,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { useMemo, useState } from 'react';

import { createEvent, deleteEvent, fetchHabitsWithEvents } from '@/requests';
import { Tables } from '@/types';

import { EditEventDialog } from './EditEventDialog';

const BORDER_WIDTH = 0.5;
const TIME_WINDOW_DAYS = 14;

// TODO: allow changing time window (7 days, 14 days, 30 days)
// TODO: can we stagger event data fetch (by date), instead of fetching all at once?
// TODO: format  date range at the top to look nicer
export const ScrollingActivity = () => {
  // Start with current week
  const [weekStart, setWeekStart] = useState(() =>
    addDays(
      startOfWeek(new Date(), { weekStartsOn: 0 }),
      -(TIME_WINDOW_DAYS - 7),
    ),
  );
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: habitsWithEvents = [] } = useQuery(fetchHabitsWithEvents);

  const createEventMutation = useMutation(createEvent);
  const deleteEventMutation = useMutation(deleteEvent);

  const onUpdateEvent = async ({
    eventId,
    habitId,
    date,
  }: {
    eventId: number | null;
    habitId: number;
    date: string;
  }) => {
    try {
      if (eventId) {
        await deleteEventMutation.mutateAsync(eventId);
      } else {
        await createEventMutation.mutateAsync({
          habitId,
          date,
        });
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const habitsWithDateList = useMemo(() => {
    const habits = habitsWithEvents.map((habit) => {
      const dateList = Array.from({ length: TIME_WINDOW_DAYS }, (_, i) => {
        const dateObj = addDays(weekStart, i);
        const dateStr = format(dateObj, 'yyyy-MM-dd');
        const event = habit.event?.find(
          (e: Tables<'event'>) => e.date === dateStr,
        );
        return {
          date: dateStr,
          formattedDate: format(dateObj, 'EEE, MMM d, yyyy'),
          completed: !!event,
          eventId: event?.id,
        };
      });
      return {
        ...habit,
        dateList,
      };
    });
    return habits;
  }, [habitsWithEvents, weekStart]);

  const habitCount = habitsWithDateList.length;

  const getCellStyles = (date: string, col: number) => {
    const borderStyles = {
      borderLeftWidth: 0,
      borderRightWidth: BORDER_WIDTH,
      backgroundColor: 'transparent',
      borderColor: 'var(--gray-10)',
    };
    if ([0, 6].includes(addDays(weekStart, col).getDay())) {
      borderStyles.backgroundColor = 'var(--gray-2)';
    }
    if (date === today) {
      borderStyles.borderLeftWidth = BORDER_WIDTH * 3;
      borderStyles.borderRightWidth = BORDER_WIDTH * 4;
      borderStyles.backgroundColor = 'var(--accent-3)';
      borderStyles.borderColor = 'var(--accent-8)';
    }
    if (col === TIME_WINDOW_DAYS - 1) {
      borderStyles.borderRightWidth = 0;
    }
    if (col === 0) {
      borderStyles.borderLeftWidth = 0;
    }

    return borderStyles;
  };

  return (
    <Flex direction="column" gap="3" maxWidth="100%">
      <Flex align="center" justify="center" gap="2">
        <IconButton
          onClick={() => setWeekStart(subDays(weekStart, TIME_WINDOW_DAYS))}
          variant="outline"
          aria-label="Previous week"
          ml="6"
        >
          <ChevronLeftIcon />
        </IconButton>
        <Text size="2">
          {format(weekStart, 'MMM d, yyyy')} -{' '}
          {format(addDays(weekStart, TIME_WINDOW_DAYS - 1), 'MMM d, yyyy')}
        </Text>
        <IconButton
          onClick={() => setWeekStart(addDays(weekStart, TIME_WINDOW_DAYS))}
          variant="outline"
          aria-label="Next week"
        >
          <ChevronRightIcon />
        </IconButton>
        <Tooltip content="Reset to current date" delayDuration={300}>
          <IconButton
            variant="outline"
            onClick={() =>
              setWeekStart(
                addDays(
                  startOfWeek(new Date(), { weekStartsOn: 0 }),
                  -(TIME_WINDOW_DAYS - 7),
                ),
              )
            }
          >
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </Flex>
      <Grid
        columns={`${TIME_WINDOW_DAYS + 2}`}
        flow="row"
        width="100%"
        justify="center"
        align="center"
      >
        {/* Two empty divs to take up first two cells in the row, used by the habit label column */}
        <div />
        <div />
        {Array.from({ length: TIME_WINDOW_DAYS }, (_, i) => {
          const dateObj = addDays(weekStart, i);
          return (
            <Tooltip key={i} content={format(dateObj, 'EEE, MMM d, yyyy')}>
              <Text
                key={i}
                size="1"
                weight="medium"
                mb="2"
                style={{
                  color: [0, 6].includes(dateObj.getDay())
                    ? 'var(--gray-8)'
                    : 'inherit',
                  textAlign: 'center',
                  textDecoration:
                    format(dateObj, 'yyyy-MM-dd') === today
                      ? 'underline'
                      : 'none',
                }}
              >
                {format(dateObj, 'EEEEE d')}
              </Text>
            </Tooltip>
          );
        })}
        {habitsWithDateList.map((habit, row) => (
          <>
            <Tooltip key={habit.id} content={habit.name} delayDuration={300}>
              <Text
                size="1"
                mr="1"
                style={{
                  gridColumnStart: '1',
                  gridColumnEnd: '3',
                  textAlign: 'left',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {habit.name}
              </Text>
            </Tooltip>
            {habit.dateList.map((data, col) => (
              <EditEventDialog
                date={data.date}
                isEventCompleted={!!data.eventId}
                habitName={habit.name}
                onConfirm={() =>
                  onUpdateEvent({
                    eventId: data.eventId || null,
                    habitId: habit.id,
                    date: data.date,
                  })
                }
              >
                <Flex
                  m="auto"
                  style={{
                    height: 40,
                    width: '100%',
                    borderStyle: 'solid',
                    borderTopWidth: 0,
                    borderBottomWidth:
                      row === habitCount - 1 ? 0 : BORDER_WIDTH,
                    ...getCellStyles(data.date, col),
                  }}
                >
                  <Dialog.Trigger>
                    {data.completed ? (
                      <Box
                        m="2"
                        style={{
                          backgroundColor: `var(--${habit.color}-3)`,
                          border: `2px solid var(--${habit.color}-8)`,
                          borderRadius: 4,
                          flex: 1,
                        }}
                      >
                        <Button
                          variant="ghost"
                          color="gray"
                          style={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                            padding: 0,
                            margin: 0,
                            borderRadius: 0,
                          }}
                        />
                      </Box>
                    ) : (
                      <Button
                        variant="ghost"
                        style={{
                          width: 'calc(100% - 12px)',
                          height: 'calc(100% - 12px)',
                          padding: 0,
                          margin: 6,
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          m="auto"
                          style={{
                            backgroundColor: '#818181',
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                          }}
                        />
                      </Button>
                    )}
                  </Dialog.Trigger>
                </Flex>
              </EditEventDialog>
            ))}
          </>
        ))}
      </Grid>
    </Flex>
  );
};
