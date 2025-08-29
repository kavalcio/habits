import { PlusIcon } from '@radix-ui/react-icons';
import {
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Grid,
  Heading,
  Text,
} from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';

import { AddEditHabitDialog } from '@/components';
import { fetchHabits as fetchHabitsRequest } from '@/requests';

export const Dashboard = () => {
  const { data, error, isPending } = useQuery(fetchHabitsRequest);

  if (isPending) return <div>loading...</div>;
  if (error) return <div>error: {error.message}</div>;
  if (!data) return <div>events not found</div>;

  return (
    <Container size="3">
      <Flex gap="2" direction="column">
        <Flex>
          <Heading size="4" align="left">
            Dashboard
          </Heading>
          <AddEditHabitDialog>
            <Dialog.Trigger>
              <Button variant="outline" ml="auto">
                <PlusIcon /> Add Habit
              </Button>
            </Dialog.Trigger>
          </AddEditHabitDialog>
        </Flex>
        <Grid
          width="auto"
          gap="3"
          columns={{
            initial: '1',
            sm: '3',
          }}
        >
          {data?.map((habit, index) => (
            <Card asChild key={index}>
              <RouterLink to={`/habit/${habit.id}`}>
                <Flex height={'100%'} align="center" gap="2">
                  <div
                    style={{
                      backgroundColor: habit.color,
                      minWidth: 12,
                      height: '100%',
                      borderRadius: 4,
                    }}
                  />
                  <Text>{habit.name}</Text>
                </Flex>
              </RouterLink>
            </Card>
          ))}
        </Grid>
      </Flex>
    </Container>
  );
};
