import { Pencil1Icon } from '@radix-ui/react-icons';
import {
  Box,
  Callout,
  Container,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  Theme,
} from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
  AddEditHabitDialog,
  Chart,
  EventCalendar,
  FormError,
  ScrollingActivity,
  YearGrid,
} from '@/components';
import { fetchHabitWithEvents } from '@/requests';
import { calculateChartData } from '@/utils';

export const HabitOverview = () => {
  const params = useParams();

  const habitId = Number(params.habitId);

  const {
    data: habit,
    error,
    isPending,
  } = useQuery(fetchHabitWithEvents(habitId));

  const chartData = useMemo(() => calculateChartData(habit), [habit]);

  if (isPending || !chartData) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 300 }}>
        <Spinner size="3" />
      </Flex>
    );
  }
  if (error) {
    return (
      <Container size="1">
        <FormError message="Error loading habit" />
      </Container>
    );
  }
  if (!habit || !habitId || isNaN(habitId)) {
    return (
      <Container size="1">
        <Callout.Root color="gray">
          <Callout.Icon />
          <Callout.Text>
            <Text color="gray">
              The habit you are looking for does not exist.
            </Text>
          </Callout.Text>
        </Callout.Root>
      </Container>
    );
  }

  return (
    <Theme accentColor={habit.color as any}>
      <Container size="3">
        <Flex gap="4" direction="column">
          <Flex width="100%" align="center" gap="3">
            <Heading size="4">{habit.name}</Heading>
            <AddEditHabitDialog habit={habit}>
              <Dialog.Trigger>
                <IconButton size="1" variant="ghost">
                  <Pencil1Icon />
                </IconButton>
              </Dialog.Trigger>
            </AddEditHabitDialog>
          </Flex>
          <ScrollingActivity habitsWithEvents={[habit]} singleItemView={true} />
          <YearGrid habit={habit} />
          <Flex direction="row" align="start" gap="5">
            <EventCalendar habit={habit} />
            <Box style={styles.chartContainer}>
              <Chart series={[chartData?.daysCompletedPerWeek.all]} />
              <Heading size="3" style={styles.chartTitle}>
                Weekly Activity
              </Heading>
            </Box>
          </Flex>
          {chartData?.daysCompletedPerWeek.perTag.length > 0 && (
            <Box style={styles.chartContainer}>
              <Chart series={chartData?.daysCompletedPerWeek.perTag} />
              <Heading size="3" style={styles.chartTitle}>
                Tags Used
              </Heading>
            </Box>
          )}
          <Flex direction="row" align="start" gap="3">
            {/* <Box style={styles.chartContainer}>
              <Flex direction="column" p="3" align="start" height="100%">
                <Heading size="3" mb="2">
                  Activity
                </Heading>
                <Flex align="center" justify="between" width="100%">
                  <Text size="1">Last 30 days</Text>
                  <Text size="6" style={styles.chartBigText}>
                    {chartData?.eventCountLast30Days}
                  </Text>
                </Flex>
                <Flex align="center" justify="between" width="100%">
                  <Text size="1">Last 12 months</Text>
                  <Text size="6" style={styles.chartBigText}>
                    {chartData?.eventCountLast12Months}
                  </Text>
                </Flex>
                <Flex align="center" justify="between" width="100%">
                  <Text size="1">All time</Text>
                  <Text size="6" style={styles.chartBigText}>
                    {chartData?.eventCountAllTime}
                  </Text>
                </Flex>
              </Flex>
            </Box> */}
            {/* <Box style={styles.chartContainer}>
              <Flex direction="column" p="3" align="start" height="100%">
                <Heading size="3" mb="2">
                  Weekly average
                </Heading>
                <Text size="8" style={styles.chartBigText}>
                  {chartData?.averageEventsCompletedPerWeek.toFixed(2)}
                </Text>
              </Flex>
            </Box> */}
          </Flex>
        </Flex>
      </Container>
    </Theme>
  );
};

const styles = {
  chartContainer: {
    position: 'relative',
    flexGrow: 1,
    height: 200,
    borderRadius: 6,
    border: '1px solid var(--gray-8)',
    backgroundColor: 'var(--gray-2)',
  },
  chartTitle: {
    position: 'absolute',
    top: 2,
    left: 2,
    padding: 10,
    backgroundColor: 'var(--gray-2)',
    borderRadius: 6,
  },
  chartBigText: {
    fontWeight: 700,
    // fontSize: 30,
  },
} as const;
