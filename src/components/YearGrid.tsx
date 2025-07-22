import { Button, Grid, Text, Tooltip } from '@radix-ui/themes';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { Event } from 'src/types';

export const YearGrid = ({
  color,
  events,
}: {
  color: string;
  events: Event[];
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Memoized helper: get all dates for the selected year (Jan 1 to Dec 31)
  const allDates = useMemo(() => {
    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear, 11, 31);
    const dates: Date[] = [];
    const d = new Date(start);
    while (d <= end) {
      dates.push(new Date(d));
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
  }, [selectedYear]);

  // Set of completed dates for quick lookup
  const completedDates = useMemo(
    () =>
      new Set(
        (events || []).map((e: Event) =>
          format(new Date(e.date), 'yyyy-MM-dd'),
        ),
      ),
    [events],
  );

  // Year navigation (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          variant="ghost"
          disabled={selectedYear === years[years.length - 1]}
          onClick={() => setSelectedYear((y) => y - 1)}
          size="1"
        >
          {'<'}
        </Button>
        <Text as="div" size="3" style={{ minWidth: 80, textAlign: 'center' }}>
          {selectedYear}
        </Text>
        <Button
          variant="ghost"
          disabled={selectedYear === years[0]}
          onClick={() => setSelectedYear((y) => y + 1)}
          size="1"
        >
          {'>'}
        </Button>
      </div>
      <Grid columns="53" gap="4px" flow="column" width="fit-content">
        {allDates.map((date, idx) => {
          if (!date)
            return (
              <div
                key={idx}
                style={{
                  width: 12,
                  height: 12,
                  margin: 0,
                  borderRadius: 2,
                  backgroundColor: 'transparent',
                }}
              />
            );
          const week = Math.floor(idx / 7);
          const day = idx % 7;
          const dateStr = format(date, 'yyyy-MM-dd');
          const isCompleted = completedDates.has(dateStr);
          return (
            <Tooltip content={format(date, 'EEE, MMM d, yyyy')} key={dateStr}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: isCompleted ? color : '#2d2d2d',
                  border: isCompleted ? '1px solid #222' : '1px solid #444',
                  gridColumn: week + 1,
                  gridRow: day + 1,
                }}
              />
            </Tooltip>
          );
        })}
      </Grid>
    </>
  );
};
