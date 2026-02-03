import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import {
  Flex,
  Grid,
  IconButton,
  ScrollArea,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addDays, addWeeks, format, startOfWeek, subWeeks } from 'date-fns';
import { useMemo, useState } from 'react';

import { createEvent, deleteEvent, fetchHabitsWithEvents } from '@/requests';
import { Tables } from '@/types';

const TIME_WINDOW_DAYS = 14;
// const TIME_WINDOW_DAYS = 7;

// TODO: allow changing time window (7 days, 14 days, 30 days)
// TODO: highlight current day on top row of the grid
// TODO: can we stagger event data fetch (by date), instead of fetching all at once?
export const ScrollingActivity = () => {
  // Start with current week
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 }),
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

  console.log('habitsWithDateList', habitsWithDateList);

  return (
    <Flex direction="column" gap="3" maxWidth="100%">
      <Flex align="center" justify="between">
        <IconButton
          onClick={() => setWeekStart(subWeeks(weekStart, 1))}
          variant="soft"
          aria-label="Previous week"
        >
          <ChevronLeftIcon />
        </IconButton>
        <Text>
          {format(weekStart, 'MMM d, yyyy')} -{' '}
          {format(addDays(weekStart, TIME_WINDOW_DAYS - 1), 'MMM d, yyyy')}
        </Text>
        <IconButton
          onClick={() => setWeekStart(addWeeks(weekStart, 1))}
          variant="soft"
          aria-label="Next week"
        >
          <ChevronRightIcon />
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
            <Text
              key={i}
              size="1"
              weight="medium"
              style={{
                textAlign: 'center',
              }}
            >
              {format(dateObj, 'EEE')}
            </Text>
          );
        })}
        {habitsWithDateList.map((habit) => (
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
                  whiteSpace: 'nowrap',
                  // display: '-webkit-box',
                  // WebkitLineClamp: 2,
                  // WebkitBoxOrient: 'vertical',
                }}
              >
                {habit?.name}
              </Text>
            </Tooltip>
            {habit.dateList.map((data) => (
              <Tooltip
                key={data.date}
                content={data.formattedDate}
                delayDuration={300}
              >
                <IconButton
                  variant={data.completed ? 'solid' : 'surface'}
                  // variant="surface"
                  color={(data.completed ? habit.color : 'gray') as any}
                  style={{
                    height: 32,
                    width: '100%',
                    borderRadius: 0,
                    // borderRadius: 4,
                    // border:
                    //   data.date === today
                    //     ? '2px solid var(--accent-9)'
                    //     : data.completed
                    //       ? 'none'
                    //       : '1px solid var(--gray-5)',
                    fontWeight: 600,
                    // border: '5px solid red',
                    // border: 'none',
                  }}
                  aria-label={data.formattedDate}
                >
                  {/* {DAY_LABELS[idx % 7]} */}
                </IconButton>
              </Tooltip>
            ))}
          </>
        ))}
      </Grid>
    </Flex>
  );
};
