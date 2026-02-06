import { Container, Flex } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';

import { HabitList, ScrollingActivity } from '@/components';
import { fetchHabitsWithEvents } from '@/requests';

export const Dashboard = () => {
  const { data = [], error, isPending } = useQuery(fetchHabitsWithEvents);

  // TODO: use proper loading/error states
  if (isPending) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!data) return <div>events not found</div>;

  return (
    <Container size="3">
      <Flex gap="8" direction="column">
        <ScrollingActivity habitsWithEvents={data} />
        <HabitList habits={data} />
      </Flex>
    </Container>
  );
};
