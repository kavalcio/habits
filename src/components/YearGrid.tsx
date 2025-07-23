import { Flex, Grid, IconButton, Select, Tooltip } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { Event } from 'src/types';

import { createEvent, deleteEvent } from '@/requests';

type DateData = {
  date: string;
  formattedDate: string;
  completed: boolean;
  eventId?: string;
};

// TODO: add month and day of the week legend
// TODO: make cells clickable to add events
// TODO: prevent grid from being squished on small screens
export const YearGrid = ({
  habitId,
  events = [],
}: {
  habitId: string;
  events?: Event[];
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

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
      const dateEvent = events.find((e) => e.date === dString);

      dates.push({
        date: dString,
        formattedDate: format(d, 'EEE, MMM d, yyyy'),
        completed: !!dateEvent,
        eventId: dateEvent?.id,
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

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const onCreateEvent = async (date: string) => {
    await createEventMutation.mutateAsync({
      habitId,
      date,
    });
  };

  const onDeleteEvent = async (eventId: string) => {
    await deleteEventMutation.mutateAsync(eventId);
  };

  return (
    <Flex direction="column" gap="2" maxWidth="fit-content" mx="auto">
      <Flex ml="auto">
        <Select.Root
          size="1"
          defaultValue={currentYear.toString()}
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
      </Flex>
      <Grid columns="53" gap="3px" flow="column" width="fit-content">
        {allDates.map((data, idx) => {
          if (!data)
            return (
              <div
                key={idx}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: 'transparent',
                }}
              />
            );
          const week = Math.floor(idx / 7);
          const day = idx % 7;
          return (
            <Tooltip key={idx} content={data.formattedDate} delayDuration={300}>
              <IconButton
                onClick={() =>
                  data.completed
                    ? onDeleteEvent(data.eventId!)
                    : onCreateEvent(data.date)
                }
                variant={data.completed ? 'solid' : 'soft'}
                {...(!data.completed && { color: 'gray' })}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  border: data.completed ? 'none' : '1px solid #2a2a2aff',
                  gridColumn: week + 1,
                  gridRow: day + 1,
                }}
              />
            </Tooltip>
          );
        })}
      </Grid>
    </Flex>
  );
};
