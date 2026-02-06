import { PlusIcon } from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Heading,
  Text,
} from '@radix-ui/themes';
import { Link as RouterLink } from 'react-router-dom';

import { Tables } from '@/types';

import { AddEditHabitDialog } from './AddEditHabitDialog';

export const HabitList = ({ habits }: { habits: Tables<'habit'>[] }) => {
  return (
    <Box>
      <Flex mb="3">
        <Heading size="4" align="left">
          Habits
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
        {habits?.map((habit, index) => (
          <Card asChild key={index}>
            <RouterLink to={`/habit/${habit.id}`}>
              <Flex height={'100%'} align="center" gap="2">
                <div
                  style={{
                    backgroundColor: `var(--${habit.color}-9)`,
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
    </Box>
  );
};
