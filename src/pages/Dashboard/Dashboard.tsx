import { PlusIcon } from '@radix-ui/react-icons';
import {
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Grid,
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
    <Container>
      <Flex gap="2" direction="column">
        <AddEditHabitDialog>
          <Dialog.Trigger>
            <Button variant="outline" mb="3" ml="auto">
              <PlusIcon /> Add Habit
            </Button>
          </Dialog.Trigger>
        </AddEditHabitDialog>
        <Grid
          width="auto"
          gap="3"
          columns={{
            initial: '1',
            sm: '3',
          }}
        >
          {data?.map((habit: any) => (
            <Card asChild>
              <RouterLink to={`/habit/${habit.id}`}>
                <Flex height={'100%'} align="center" gap="2">
                  <div
                    style={{
                      backgroundColor: habit.color,
                      width: 20,
                      height: 20,
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
