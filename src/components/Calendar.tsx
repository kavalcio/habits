import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ResetIcon,
} from '@radix-ui/react-icons';
import {
  Button,
  Flex,
  Grid,
  IconButton,
  Text,
  Tooltip,
} from '@radix-ui/themes';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

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

const ITEM_SIZE = 35; // Size of each calendar item in pixels
const TOTAL_WIDTH = ITEM_SIZE * 7 + 4 * 6; // 259px = 35px for each day, 4px gap between days, 6px padding

type CalendarDate = {
  label: string;
  date?: string;
  disabled?: boolean;
  muted?: boolean;
};

export const Calendar = ({
  events,
  onDateSelect,
}: {
  events?: Tables<'event'>[];
  onDateSelect?: (date: string) => void;
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const [activeView, setActiveView] = useState<'month' | 'year'>('month');

  const shiftCalendar = (delta: number) => {
    if (activeView === 'year') {
      setSelectedYear((prev) => prev + delta);
    } else {
      const newDate = new Date(selectedYear, selectedMonth + delta);
      setSelectedYear(newDate.getFullYear());
      setSelectedMonth(newDate.getMonth());
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');

  const eventsIndexedByDate = useMemo(() => {
    const indexed: Record<string, Tables<'event'>> = {};
    events?.forEach((event) => {
      indexed[event.date] = event;
    });
    return indexed;
  }, [events]);

  const gridItemList = useMemo<CalendarDate[]>(() => {
    const items: CalendarDate[] = [];
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // Add weekday labels at the top
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
        date: format(dayOfLastMonth, 'yyyy-MM-dd'),
      });
    }

    // Fill in the days of the month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      items.push({
        label: day.toString(),
        date: format(new Date(selectedYear, selectedMonth, day), 'yyyy-MM-dd'),
      });
    }

    // Pad the end of the month with items until the last day of the week
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
        date: format(dayOfNextMonth, 'yyyy-MM-dd'),
      });
    }

    return items;
  }, [selectedYear, selectedMonth]);

  return (
    <Flex width={`${TOTAL_WIDTH}px`} direction="column" gap="1">
      <Flex width="100%" justify="between" gap="1">
        <IconButton variant="outline" onClick={() => shiftCalendar(-1)}>
          <ChevronLeftIcon />
        </IconButton>
        <Button
          variant="outline"
          style={{ flex: 1 }}
          onClick={() =>
            setActiveView(activeView === 'year' ? 'month' : 'year')
          }
        >
          <Text>
            {activeView === 'year'
              ? selectedYear
              : `${MONTHS[selectedMonth]} ${selectedYear}`}
          </Text>
        </Button>
        <IconButton variant="outline" onClick={() => shiftCalendar(1)}>
          <ChevronRightIcon />
        </IconButton>
        <Tooltip content="Reset to current date" delayDuration={300}>
          <IconButton
            variant="outline"
            onClick={() => {
              setSelectedYear(new Date().getFullYear());
              setSelectedMonth(new Date().getMonth());
              setActiveView('month');
            }}
          >
            <ResetIcon />
          </IconButton>
        </Tooltip>
      </Flex>
      {activeView === 'month' ? (
        <Grid columns="7" rows="7" gap="1">
          {gridItemList.map(({ label, disabled, muted, date }, index) => (
            <Button
              key={index}
              disabled={disabled}
              variant={
                disabled || muted
                  ? 'ghost'
                  : !!date && !!eventsIndexedByDate[date] && !muted
                    ? 'solid'
                    : 'soft'
              }
              style={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
                margin: 0,
                padding: 0,
                ...(muted && { color: 'var(--gray-9)' }),
                ...(date === today &&
                  !muted && {
                    border: '2px solid var(--white-a8)',
                  }),
              }}
              onClick={() => {
                if (date && onDateSelect) {
                  onDateSelect(date);
                }
              }}
            >
              <Text>{label}</Text>
            </Button>
          ))}
        </Grid>
      ) : (
        <Grid columns="3" gap="1">
          {MONTHS.map((month, index) => (
            <Button
              key={index}
              variant="ghost"
              style={{
                height: ITEM_SIZE,
                margin: 0,
                padding: 0,
              }}
              onClick={() => {
                setSelectedMonth(index);
                setActiveView('month');
              }}
            >
              <Text>{month.slice(0, 3)}</Text>
            </Button>
          ))}
        </Grid>
      )}
    </Flex>
  );
};
