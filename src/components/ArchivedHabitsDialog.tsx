import { Cross1Icon, ResetIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  IconButton,
  Spinner,
  Text,
  useThemeContext,
} from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { fetchArchivedHabits, restoreHabit } from '@/requests';

export const ArchivedHabitsDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="soft">View Archived Habits</Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="500px">
        <ArchivedHabitsDialogContent />
      </Dialog.Content>
    </Dialog.Root>
  );
};

const ArchivedHabitsDialogContent = () => {
  const theme = useThemeContext();
  const { data, isPending } = useQuery(fetchArchivedHabits);

  const restoreHabitMutation = useMutation(restoreHabit);

  const onRestore = async (habitId: number) => {
    try {
      await restoreHabitMutation.mutateAsync(habitId);
      enqueueSnackbar('Habit restored', { variant: 'success' });
    } catch (error) {
      console.error('Failed to restore habit', error);
      enqueueSnackbar('Failed to restore habit', { variant: 'error' });
    }
  };

  return (
    <Flex direction="column" gap="4" align="baseline" minHeight="500px">
      <Flex align="start" justify="between" width="100%">
        <Dialog.Title>Archived Habits</Dialog.Title>
        <Dialog.Close>
          <IconButton variant="ghost" size="2">
            <Cross1Icon />
          </IconButton>
        </Dialog.Close>
      </Flex>
      {isPending ? (
        <Spinner size="3" />
      ) : data?.length === 0 ? (
        <Text>No archived habits found.</Text>
      ) : (
        data?.map((habit, index) => (
          <Card key={index} style={{ width: '100%' }}>
            <Flex height={'100%'} align="center" gap="2">
              <Box
                style={{
                  backgroundColor: `var(--${habit.color}-9)`,
                  minWidth: 12,
                  height: '100%',
                  minHeight: 24,
                  borderRadius: 4,
                }}
              />
              <Text weight="medium" style={{ overflow: 'hidden' }}>
                {habit.name}
              </Text>
              <AlertDialog.Root>
                <AlertDialog.Content>
                  <Flex direction="column" align="start" gap="2">
                    <AlertDialog.Title align="left">
                      Restore{' '}
                      <Text weight="bold" color={theme.accentColor}>
                        {habit?.name ?? 'this habit'}
                      </Text>
                      ?
                    </AlertDialog.Title>
                    <AlertDialog.Description size="2" align="left">
                      This will restore the habit to your dashboard.
                    </AlertDialog.Description>
                    <Flex width="100%" justify="end" gap="2" mt="4">
                      <AlertDialog.Cancel>
                        <Button variant="soft">Cancel</Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button
                          onClick={() => onRestore(habit.id)}
                          loading={restoreHabitMutation.isPending}
                          disabled={restoreHabitMutation.isPending}
                        >
                          Restore Habit
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </Flex>
                </AlertDialog.Content>
                <AlertDialog.Trigger>
                  <Button variant="soft" ml="auto">
                    <ResetIcon />
                    Restore
                  </Button>
                </AlertDialog.Trigger>
              </AlertDialog.Root>
            </Flex>
          </Card>
        ))
      )}
    </Flex>
  );
};
