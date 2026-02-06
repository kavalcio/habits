import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ResetIcon,
} from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  Heading,
  IconButton,
  Link,
  ScrollArea,
  Select,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Routes } from '@/constants';
import { createEvent, deleteEvent } from '@/requests';
import { Tables } from '@/types';

import { EditEventDialog } from './EditEventDialog';

const BORDER_WIDTH = 0.5;
const TIME_WINDOW_OPTIONS = [7, 14, 21];

export const ScrollingActivity = ({
  habitsWithEvents,
}: {
  habitsWithEvents: (Tables<'habit'> & { event?: Tables<'event'>[] })[];
}) => {
  const [dateSpan, setDateSpan] = useState(TIME_WINDOW_OPTIONS[1]);
  const [weekStart, setWeekStart] = useState(() =>
    addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), -(dateSpan - 7)),
  );
  const today = format(new Date(), 'yyyy-MM-dd');

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
      const dateList = Array.from({ length: dateSpan }, (_, i) => {
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
  }, [habitsWithEvents, weekStart, dateSpan]);

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
      borderStyles.backgroundColor = 'var(--accent-2)';
      borderStyles.borderColor = 'var(--accent-8)';
    }
    if (col === dateSpan - 1) {
      borderStyles.borderRightWidth = 0;
    }
    if (col === 0) {
      borderStyles.borderLeftWidth = 0;
    }

    return borderStyles;
  };

  const dateRangeLabel = useMemo(() => {
    // Show MMM yyyy if within the same month
    // Show MMM - MMM yyyy if spanning two months
    const startDate = weekStart;
    const endDate = addDays(weekStart, dateSpan - 1);
    if (startDate.getMonth() === endDate.getMonth()) {
      return format(startDate, 'MMM yyyy');
    } else {
      return `${format(startDate, 'MMM')} - ${format(endDate, 'MMM yyyy')}`;
    }
  }, [weekStart, dateSpan]);

  return (
    <Flex direction="column" gap="3" maxWidth="100%">
      <Flex align="center" justify="between" gap="2" wrap="wrap">
        <Heading size="4" align="left">
          Dashboard
        </Heading>
        <Flex align="center" gap="1">
          <IconButton
            onClick={() => setWeekStart(subDays(weekStart, dateSpan))}
            variant="outline"
            aria-label="Previous week"
          >
            <ChevronLeftIcon />
          </IconButton>
          <Text size="2" style={{ width: 120 }}>
            {dateRangeLabel}
          </Text>
          <IconButton
            onClick={() => setWeekStart(addDays(weekStart, dateSpan))}
            variant="outline"
            aria-label="Next week"
          >
            <ChevronRightIcon />
          </IconButton>
          <Tooltip content="Reset to current date" delayDuration={300}>
            <IconButton
              variant="outline"
              size="2"
              onClick={() =>
                setWeekStart(
                  addDays(
                    startOfWeek(new Date(), { weekStartsOn: 0 }),
                    -(dateSpan - 7),
                  ),
                )
              }
            >
              <ResetIcon />
            </IconButton>
          </Tooltip>
          <Select.Root
            size="2"
            value={`${dateSpan}`}
            onValueChange={(v) => setDateSpan(Number(v))}
          >
            <Select.Trigger />
            <Select.Content>
              {TIME_WINDOW_OPTIONS.map((days) => (
                <Select.Item key={days} value={days.toString()}>
                  {days} days
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
      <ScrollArea scrollbars="horizontal" scrollHideDelay={600}>
        <Grid
          columns={`${dateSpan + 2}`}
          flow="row"
          width="100%"
          justify="center"
          align="center"
          minWidth={`${dateSpan === 7 ? 400 : dateSpan === 14 ? 600 : 800}px`}
          pb="3"
        >
          {/* Two empty divs to take up first two cells in the row, used by the habit label column */}
          <div />
          <div />
          {Array.from({ length: dateSpan }, (_, i) => {
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
              <Tooltip key={habit.id} content={habit.name} delayDuration={1000}>
                <Text
                  size="1"
                  mr="1"
                  asChild
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
                  <Link asChild style={{ color: 'var(--gray-12)' }}>
                    <RouterLink
                      to={Routes.HABIT_OVERVIEW.replace(
                        ':habitId',
                        habit.id.toString(),
                      )}
                    >
                      {habit.name}
                    </RouterLink>
                  </Link>
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
                          style={{
                            backgroundColor: `var(--${habit.color}-3)`,
                            border: `2px solid var(--${habit.color}-8)`,
                            borderRadius: 4,
                            flex: 1,
                            marginTop: 8,
                            marginBottom: 8,
                            marginLeft:
                              8 - (data.date === today ? BORDER_WIDTH * 3 : 0),
                            marginRight:
                              8 - (data.date === today ? BORDER_WIDTH * 3 : 0),
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
      </ScrollArea>
    </Flex>
  );
};
