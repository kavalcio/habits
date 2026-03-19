import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { Fragment, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Routes } from '@/constants';
import { HabitWithEvents } from '@/types';

import { EditEventDialog } from './EditEventDialog';

const BORDER_WIDTH = 1;
const TIME_WINDOW_OPTIONS = [7, 14, 21];

export const ScrollingActivity = ({
  habitsWithEvents,
}: {
  habitsWithEvents: HabitWithEvents[];
}) => {
  const [dateSpan, setDateSpan] = useState(() => {
    const stored = localStorage.getItem('dateSpan');
    return stored ? parseInt(stored, 10) : TIME_WINDOW_OPTIONS[1];
  });
  const [weekStart, setWeekStart] = useState(() =>
    addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), -(dateSpan - 7)),
  );
  const today = format(new Date(), 'yyyy-MM-dd');

  const habitsWithDateList = useMemo(() => {
    const habits = habitsWithEvents.map((habit) => {
      const dateList = Array.from({ length: dateSpan }, (_, i) => {
        const dateObj = addDays(weekStart, i);
        const dateStr = format(dateObj, 'yyyy-MM-dd');
        const event = habit.event?.find((e) => e.date === dateStr);
        return {
          date: dateStr,
          formattedDate: format(dateObj, 'EEE, MMM d, yyyy'),
          completed: !!event,
          event: event,
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
      borderColor: 'var(--gray-3)',
    };
    if ([0, 6].includes(addDays(weekStart, col).getDay())) {
      borderStyles.backgroundColor = 'var(--gray-2)';
    }
    if (date === today) {
      borderStyles.borderLeftWidth = BORDER_WIDTH;
      borderStyles.backgroundColor = 'var(--accent-2)';
      borderStyles.borderColor = 'var(--accent-6)';
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

  const updateDateSpan = (newSpan: number) => {
    setDateSpan(newSpan);
    localStorage.setItem('dateSpan', newSpan.toString());
  };

  return (
    <Flex direction="column" gap="3" maxWidth="100%">
      <Flex align="center" justify="between" gap="2" wrap="wrap">
        <Heading size="4" align="left">
          Dashboard
        </Heading>
        <Flex align="center" gap="2">
          <IconButton
            onClick={() => setWeekStart(subDays(weekStart, 7))}
            variant="outline"
            aria-label="Previous week"
            size="1"
          >
            <ChevronLeftIcon />
          </IconButton>
          <Text size="1" style={{ width: 100 }}>
            {dateRangeLabel}
          </Text>
          <IconButton
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            variant="outline"
            aria-label="Next week"
            size="1"
          >
            <ChevronRightIcon />
          </IconButton>
          <Tooltip content="Reset to current date" delayDuration={300}>
            <IconButton
              variant="outline"
              size="1"
              onClick={() =>
                setWeekStart(
                  addDays(
                    startOfWeek(new Date(), { weekStartsOn: 0 }),
                    -(dateSpan - 7),
                  ),
                )
              }
            >
              <CalendarIcon />
            </IconButton>
          </Tooltip>
          <Select.Root
            size="1"
            value={`${dateSpan}`}
            onValueChange={(v) => updateDateSpan(Number(v))}
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
            <Fragment key={habit.id}>
              <Tooltip content={habit.name} delayDuration={1000}>
                <Text
                  size="1"
                  mr="3"
                  asChild
                  style={{
                    gridColumnStart: '1',
                    gridColumnEnd: '3',
                    textAlign: 'right',
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
                  key={col}
                  date={data.date}
                  habit={habit}
                  event={data.event}
                >
                  <Flex
                    m="auto"
                    style={{
                      height: 46,
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
                            margin: 2,
                            flex: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Button
                            variant="soft"
                            color={habit.color as any}
                            style={{
                              // backgroundColor: `var(--${habit.color}-3)`,
                              margin: 0,
                              border: `2px solid var(--${habit.color}-8)`,
                              overflow: 'hidden',
                              display: 'flex',
                              flexGrow: 1,
                              width: '100%',
                              height: '100%',
                              padding: 4,
                              borderRadius: 2,
                              alignItems: 'start',
                              justifyContent: 'start',
                            }}
                          >
                            <Flex
                              wrap="wrap"
                              gap="1"
                              align="start"
                              justify="start"
                              overflow="hidden"
                            >
                              {data.event?.event_tag.slice(0, 1).map((tag) => (
                                <Text
                                  key={tag.id}
                                  size="1"
                                  style={{
                                    padding: '1px 3px',
                                    borderRadius: 4,
                                    backgroundColor:
                                      'rgba(255, 255, 255, 0.15)',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: 11,
                                    overflow: 'hidden',
                                  }}
                                >
                                  {
                                    habit.habit_tag.find(
                                      (ht) => ht.id === tag.habit_tag_id,
                                    )?.name
                                  }
                                </Text>
                              ))}
                            </Flex>
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          variant="ghost"
                          color={habit.color as any}
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
                              backgroundColor: 'var(--gray-10)',
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
            </Fragment>
          ))}
        </Grid>
      </ScrollArea>
    </Flex>
  );
};
