import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Grid, IconButton, Text } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

import { createEvent, deleteEvent } from '@/requests';
import { Tables } from '@/types';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type CalendarDate = { label: string; disabled?: boolean; muted?: boolean };

// TODO: add button to quickly go back to current month?
// TODO: pass in events, change button style based on event presence
// TODO: add a border for today's date
// TODO: account for leap years
export const Calendar = ({
  onDateSelect,
}: {
  onDateSelect: (date: string) => void;
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const shiftMonth = (delta: number) => {
    const newDate = new Date(selectedYear, selectedMonth + delta);
    setSelectedYear(newDate.getFullYear());
    setSelectedMonth(newDate.getMonth());
  };

  console.log({
    selectedYear,
    selectedMonth,
  });

  const gridItemList = useMemo<CalendarDate[]>(() => {
    const items: CalendarDate[] = [];
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // Add week day labels at the top
    items.push(
      ...WEEK_DAYS.map((day) => ({
        label: day,
        disabled: true,
      })),
    );

    // Pad the start of the month with items until the first day of the month
    const firstDayOfWeek = firstDayOfMonth.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const dayOfLastMonth = new Date(
        selectedYear,
        selectedMonth,
        0 - (firstDayOfWeek - 1 - i),
      );
      items.push({
        label: dayOfLastMonth.getDate().toString(),
        muted: true,
      });
    }

    // Fill in the days of the month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      items.push({
        label: day.toString(),
      });
    }

    // Pad the end of the month with empty items until the last day of the week
    const lastDayOfWeek = lastDayOfMonth.getDay();
    for (let i = lastDayOfWeek + 1; i < 7; i++) {
      const dayOfNextMonth = new Date(
        selectedYear,
        selectedMonth + 1,
        i - lastDayOfWeek,
      );
      items.push({
        label: dayOfNextMonth.getDate().toString(),
        muted: true,
      });
    }

    return items;
  }, [selectedYear, selectedMonth]);

  return (
    <Flex width="fit-content" direction="column">
      <Flex width="100%" justify="between" gap="2">
        <IconButton variant="outline" onClick={() => shiftMonth(-1)}>
          <ChevronLeftIcon />
        </IconButton>
        <Button variant="outline" style={{ flex: 1 }}>
          <Text>
            {MONTHS[selectedMonth]} {selectedYear}
          </Text>
        </Button>
        <IconButton variant="outline" onClick={() => shiftMonth(1)}>
          <ChevronRightIcon />
        </IconButton>
      </Flex>
      <Grid columns="7" rows="7" gap="1" width="fit-content">
        {gridItemList.map(({ label, disabled, muted }, index) => (
          <Box
            style={{
              width: 35,
              height: 35,
            }}
          >
            <Button
              key={index}
              disabled={disabled}
              variant={disabled ? 'ghost' : muted ? 'outline' : 'solid'}
              // variant={disabled ? 'ghost' : muted ? 'ghost' : 'solid'}
              // variant={disabled ? 'ghost' : 'solid'}
              style={{
                width: 35,
                height: 35,
                // ...(muted && {
                //   backgroundColor: 'transparent',
                //   borderColor: 'transparent',
                // }),
                opacity: muted ? 0.6 : 1,
              }}
            >
              <Text>{label}</Text>
            </Button>
          </Box>
        ))}
      </Grid>
    </Flex>
  );
};
