import { Flex, Grid, Select, Tooltip } from '@radix-ui/themes';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { Event } from 'src/types';

type DateData = {
  date: Date;
  formattedDate: string;
  completed: boolean;
};

// TODO: dates are shown wrong, 1 day earlier than actual date
// TODO: add month and day of the week legend
// TODO: make cells clickable to add events
export const YearGrid = ({
  color,
  events = [],
}: {
  color: string;
  events?: Event[];
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Get all dates for the selected year (Jan 1 to Dec 31)
  const allDates = useMemo(() => {
    const completedDates = new Set(events.map((e: Event) => e.date));

    const start = new Date(selectedYear, 0, 1);
    const end = new Date(selectedYear, 11, 31);
    const dates: (DateData | null)[] = [];
    const d = new Date(start);
    while (d <= end) {
      dates.push({
        date: new Date(d),
        formattedDate: format(d, 'EEE, MMM d, yyyy'),
        completed: completedDates.has(format(d, 'yyyy-MM-dd')),
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

  return (
    <Flex direction="column" gap="2" width="fit-content" mx="auto">
      <Flex ml="auto">
        <Select.Root
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
      <Grid columns="53" gap="4px" flow="column" width="fit-content">
        {allDates.map((data, idx) => {
          if (!data)
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
          return (
            <Tooltip key={idx} content={data.formattedDate}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: data.completed ? color : '#2d2d2d',
                  border: data.completed ? '1px solid #222' : '1px solid #444',
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
