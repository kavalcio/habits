import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { createHabit, fetchHabits as fetchHabitsRequest } from '@/requests';

// TODO: swap to rtk query instead of react query
// TODO: define db schema in sql in the repo
export const Dashboard = () => {
  const { data, error, isPending } = useQuery(fetchHabitsRequest);

  const createHabitMutation = useMutation(createHabit);

  const [habitName, setHabitName] = useState<string>('');
  const [habitColor, setHabitColor] = useState<string>('#000000');

  console.log({ data, error, isPending, habitColor, habitName });

  const onCreateHabit = async () => {
    try {
      // TODO: validate that color is a color
      // TODO: validate that habitName is not empty
      await createHabitMutation.mutateAsync({
        name: habitName,
        color: habitColor,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <TextField.Root
          placeholder="Habit Name"
          onChange={(e) => setHabitName(e.target.value)}
        />
        <input
          type="color"
          placeholder="habit color"
          onChange={(e) => setHabitColor(e.target.value)}
        />
        <div>
          <Button variant="soft" onClick={onCreateHabit}>
            create habit
          </Button>
        </div>

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
      </div>
    </Container>
  );
};
