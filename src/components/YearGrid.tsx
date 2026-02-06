import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  Flex,
  Grid,
  IconButton,
  ScrollArea,
  Select,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

import { createEvent, deleteEvent } from '@/requests';
import { Tables } from '@/types';

import { EditEventDialog } from './EditEventDialog';

const GRID_COLUMN_COUNT = 53; // 52 weeks + 1 for padding
const GRID_GAP_SIZE = 3;
const GRID_ITEM_SIZE = 12;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

type DateData = {
  date: string;
  formattedDate: string;
  completed: boolean;
  eventId?: number;
};

export const YearGrid = ({
  habitId,
  events = [],
}: {
  habitId: number;
  events?: Tables<'event'>[];
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const createEventMutation = useMutation(createEvent);
  const deleteEventMutation = useMutation(deleteEvent);

  // Get all dates for the selected year (Jan 1 to Dec 31)
  const allDates = useMemo(() => {
    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear, 11, 31);
    const dates: (DateData | null)[] = [];
    const d = new Date(start);
    while (d <= end) {
      const dString = format(d, 'yyyy-MM-dd');
      const event = events.find((e) => e.date === dString);

      dates.push({
        date: dString,
        formattedDate: format(d, 'EEE, MMM d, yyyy'),
        completed: !!event,
        eventId: event?.id,
      });
      d.setDate(d.getDate() + 1);
    }
    // Pad to start on Sunday
    const padStart = start.getDay();
    for (let i = 0; i < padStart; i++) {
      dates.unshift(null);
    }
    // Pad to end on Saturday
    const padEnd = 6 - end.getDay();
    for (let i = 0; i < padEnd; i++) {
      dates.push(null);
    }
    return dates;
  }, [selectedYear, events]);

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const today = format(new Date(), 'yyyy-MM-dd');

  const onUpdateEvent = async () => {
    try {
      if (!selectedDate) return;
      const dateData = allDates.find((d) => d?.date === selectedDate);
      if (dateData?.completed) {
        await deleteEventMutation.mutateAsync(dateData.eventId!);
      } else {
        await createEventMutation.mutateAsync({
          habitId,
          date: selectedDate,
        });
      }
      setSelectedDate(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <Flex direction="column" gap="2" maxWidth="100%" mx="auto">
      <Flex ml="auto" gap="1" align="center">
        <IconButton
          onClick={() => setSelectedYear((y) => y - 1)}
          variant="outline"
          aria-label="Previous year"
          size="1"
          disabled={selectedYear <= years[years.length - 1]}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Select.Root
          size="1"
          value={`${selectedYear}`}
          onValueChange={(e) => setSelectedYear(Number(e))}
        >
          <Select.Trigger />
          <Select.Content>
            {years.map((year) => (
              <Select.Item
                key={year}
                value={year.toString()}
                onSelect={() => setSelectedYear(year)}
              >
                {year}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <IconButton
          onClick={() => setSelectedYear((y) => y + 1)}
          variant="outline"
          aria-label="Next year"
          size="1"
          disabled={selectedYear >= years[0]}
        >
          <ChevronRightIcon />
        </IconButton>
      </Flex>
      <ScrollArea scrollbars="horizontal" scrollHideDelay={600}>
        <EditEventDialog
          date={selectedDate || ''}
          isEventCompleted={
            !!allDates.find((d) => d?.date === selectedDate && d.completed)
          }
          onClose={() => setSelectedDate(null)}
          onConfirm={onUpdateEvent}
        >
          <Flex direction="row" align="start" mb="1">
            <Flex direction="column" gap={`${GRID_GAP_SIZE}px`} mr="2">
              {DAY_LABELS.map((label) => (
                <Text
                  key={label}
                  style={{
                    height: `${GRID_ITEM_SIZE}px`,
                    lineHeight: `${GRID_ITEM_SIZE}px`,
                    fontSize: 10,
                    textAlign: 'right',
                    color: '#888',
                    width: 23,
                  }}
                >
                  {label}
                </Text>
              ))}
            </Flex>
            <Grid
              columns={`${GRID_COLUMN_COUNT}`}
              gap={`${GRID_GAP_SIZE}px`}
              flow="column"
              minWidth={`${GRID_ITEM_SIZE * GRID_COLUMN_COUNT + GRID_GAP_SIZE * (GRID_COLUMN_COUNT - 1)}px`}
            >
              {allDates.map((data, idx) => {
                if (!data)
                  return (
                    <div
                      key={idx}
                      style={{
                        width: `${GRID_ITEM_SIZE}px`,
                        height: `${GRID_ITEM_SIZE}px`,
                        borderRadius: 2,
                        backgroundColor: 'transparent',
                      }}
                    />
                  );
                const week = Math.floor(idx / 7);
                const day = idx % 7;
                return (
                  <Tooltip
                    key={idx}
                    content={data.formattedDate}
                    delayDuration={300}
                  >
                    <Dialog.Trigger>
                      <IconButton
                        onClick={() => setSelectedDate(data.date)}
                        variant={data.completed ? 'solid' : 'soft'}
                        {...(!data.completed && { color: 'gray' })}
                        style={{
                          flexShrink: 0,
                          width: `${GRID_ITEM_SIZE}px`,
                          height: `${GRID_ITEM_SIZE}px`,
                          borderRadius: 2,
                          border:
                            data.date === today
                              ? '1.5px solid var(--white-a8)'
                              : data.completed
                                ? 'none'
                                : '1px solid var(--gray-5)',
                          gridColumn: week + 1,
                          gridRow: day + 1,
                        }}
                      />
                    </Dialog.Trigger>
                  </Tooltip>
                );
              })}
            </Grid>
          </Flex>
          <Flex gap="1" align="center" justify="between" ml="6" pb="4">
            {MONTH_LABELS.map((label) => (
              <Text
                key={label}
                style={{
                  fontSize: 10,
                  color: '#888',
                  width: `${GRID_ITEM_SIZE * 4 + GRID_GAP_SIZE * 3}px`,
                  textAlign: 'center',
                }}
              >
                {label}
              </Text>
            ))}
          </Flex>
        </EditEventDialog>
      </ScrollArea>
    </Flex>
  );
};
