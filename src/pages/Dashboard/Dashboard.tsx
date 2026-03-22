import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {
  Box,
  Callout,
  Card,
  Container,
  Flex,
  Grid,
  Skeleton,
  Text,
} from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';

import { HabitList, ScrollingActivity } from '@/components';
import { fetchHabitsWithEvents } from '@/requests';

function DashboardSkeleton() {
  return (
    <Flex
      gap="8"
      direction="column"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <Flex direction="column" gap="3" maxWidth="100%">
        <Skeleton height="28px" width="140px" />
        <Skeleton height="220px" width="100%" maxWidth="100%" />
      </Flex>
      <Box>
        <Flex mb="3" align="center">
          <Skeleton height="28px" width="96px" />
          <Skeleton height="32px" width="120px" ml="auto" />
        </Flex>
        <Grid
          width="auto"
          gap="3"
          columns={{
            initial: '1',
            sm: '3',
          }}
        >
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <Flex height="100%" align="center" gap="2">
                <Skeleton height="48px" width="12px" />
                <Skeleton height="20px" width="70%" />
              </Flex>
            </Card>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
}

export const Dashboard = () => {
  const { data = [], error, isPending } = useQuery(fetchHabitsWithEvents);

  if (isPending) {
    return (
      <Container size="3">
        <DashboardSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="3">
        <Callout.Root color="red" variant="surface" role="alert">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>
            <Text size="2" weight="medium">
              {error.message}
            </Text>
          </Callout.Text>
        </Callout.Root>
      </Container>
    );
  }

  return (
    <Container size="3">
      <Flex gap="8" direction="column">
        <ScrollingActivity habitsWithEvents={data} />
        <HabitList habits={data} />
      </Flex>
    </Container>
  );
};
