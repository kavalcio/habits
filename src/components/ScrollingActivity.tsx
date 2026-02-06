import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ResetIcon,
} from '@radix-ui/react-icons';
import { Box, Flex, Grid, IconButton, Text, Tooltip } from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { useMemo, useState } from 'react';

import { createEvent, deleteEvent, fetchHabitsWithEvents } from '@/requests';
import { Tables } from '@/types';

const BORDER_WIDTH = '0.5px';
const TIME_WINDOW_DAYS = 14;
// const TIME_WINDOW_DAYS = 7;

// TODO: Add button to go to today
// TODO: allow changing time window (7 days, 14 days, 30 days)
// TODO: highlight current day somehow
// TODO: can we stagger event data fetch (by date), instead of fetching all at once?
export const ScrollingActivity = () => {
  // Start with current week
  const [weekStart, setWeekStart] = useState(() =>
    addDays(
      startOfWeek(new Date(), { weekStartsOn: 0 }),
      -(TIME_WINDOW_DAYS - 7),
    ),
  );
  const today = format(new Date(), 'yyyy-MM-dd');

  // Fetch all habits with their events for the user
  const { data: habitsWithEvents = [] } = useQuery(fetchHabitsWithEvents);

  const createEventMutation = useMutation(createEvent);
  const deleteEventMutation = useMutation(deleteEvent);

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
        {/* TODO: format this date range text to look nicer */}
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
            <Tooltip
              key={i}
              content={format(dateObj, 'EEE, MMM d, yyyy')}
              delayDuration={300}
            >
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
                  // add underline for today
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
                {habit?.name}
              </Text>
            </Tooltip>
            {habit.dateList.map((data, col) => (
              <Flex
                m="auto"
                style={{
                  height: 36,
                  width: '100%',
                  borderColor: '#818181',
                  borderTopWidth: 0,
                  borderBottomWidth: row === habitCount - 1 ? 0 : BORDER_WIDTH,
                  borderLeftWidth: 0,
                  borderRightWidth:
                    col === TIME_WINDOW_DAYS - 1 ? 0 : BORDER_WIDTH,
                  borderStyle: 'solid',
                  // backgroundColor: [0, 6].includes(
                  //   addDays(weekStart, col).getDay(),
                  // )
                  //   ? 'var(--gray-2)'
                  //   : data.date === today
                  //     ? 'var(--accent-3)'
                  //     : 'transparent',
                  backgroundColor: [0, 6].includes(
                    addDays(weekStart, col).getDay(),
                  )
                    ? 'var(--gray-2)'
                    : 'transparent',
                  // backgroundColor:
                  //   data.date === today ? 'var(--gray-2)' : 'transparent',
                }}
              >
                {data.completed ? (
                  <Box
                    m="2"
                    style={{
                      backgroundColor: `var(--${habit.color}-8)`,
                      flex: 1,
                      borderRadius: 4,
                    }}
                  />
                ) : (
                  <Box
                    m="auto"
                    style={{
                      backgroundColor: '#818181',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                    }}
                  />
                )}
              </Flex>
            ))}
          </>
        ))}
      </Grid>
    </Flex>
  );
};
