import { TrashIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Text,
  TextField,
  useThemeContext,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/constants';
import { archiveHabit, createHabit, updateHabit } from '@/requests';
import { Tables } from '@/types';

import { ColorSwatchPicker } from './ColorSwatchPicker';

// TODO: show error toast on success/failure
export const AddEditHabitDialog = ({
  habit,
  children,
}: {
  habit?: Tables<'habit'>;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content maxWidth="400px">
        <AddEditHabitDialogContent habit={habit} setIsOpen={setIsOpen} />
      </Dialog.Content>
      {children}
    </Dialog.Root>
  );
};

const AddEditHabitDialogContent = ({
  habit,
  setIsOpen,
}: {
  habit?: Tables<'habit'>;
  setIsOpen: (newIsOpen: boolean) => void;
}) => {
  const navigate = useNavigate();
  const theme = useThemeContext();

  const [habitName, setHabitName] = useState<string>();
  const [habitColor, setHabitColor] = useState<string>();
  const [error, setError] = useState<string>();

  const createHabitMutation = useMutation(createHabit);
  const updateHabitMutation = useMutation(updateHabit);
  const archiveHabitMutation = useMutation(archiveHabit);

  useEffect(() => {
    if (habit) {
      setHabitName(habit.name);
      setHabitColor(habit.color);
    } else {
      setHabitName('');
      setHabitColor('');
    }
  }, [habit]);

  const onCreateHabit = async () => {
    if (!habitName || !habitColor) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');

    await createHabitMutation.mutateAsync({
      name: habitName,
      color: habitColor,
    });

    setIsOpen(false);
  };

  const onUpdateHabit = async () => {
    if (!habitName || !habitColor || !habit?.id) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');

    await updateHabitMutation.mutateAsync({
      habitId: habit.id!,
      name: habitName!,
      color: habitColor!,
    });

    setIsOpen(false);
  };

  const onArchiveHabit = async () => {
    if (!habit) return;
    await archiveHabitMutation.mutateAsync(habit.id);
    navigate(Routes.DASHBOARD, { replace: true });
  };

  return (
    <Flex direction="column">
      <Flex>
        <Dialog.Title mr="auto" align="left">
          {habit ? 'Edit' : 'Add'} Habit
        </Dialog.Title>
        <AlertDialog.Root>
          <AlertDialog.Content>
            <Flex direction="column" align="start" gap="2">
              <AlertDialog.Title align="left">
                Archive{' '}
                <Text weight="bold" color={theme.accentColor}>
                  {habit?.name ?? 'this habit'}
                </Text>
                ?
              </AlertDialog.Title>
              <AlertDialog.Description size="2" align="left">
                This will remove the habit from your dashboard.
                <br />
                You can restore it later from the{' '}
                <Text weight="bold" color={theme.accentColor}>
                  Profile
                </Text>{' '}
                page if needed.
              </AlertDialog.Description>
              <Flex width="100%" justify="end" gap="2" mt="4">
                <AlertDialog.Cancel>
                  <Button variant="soft">Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    color="red"
                    onClick={onArchiveHabit}
                    loading={archiveHabitMutation.isPending}
                    disabled={archiveHabitMutation.isPending}
                  >
                    <TrashIcon />
                    Archive Habit
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </Flex>
          </AlertDialog.Content>
          {!!habit && (
            <AlertDialog.Trigger>
              <IconButton size="1" variant="soft">
                <TrashIcon />
              </IconButton>
            </AlertDialog.Trigger>
          )}
        </AlertDialog.Root>
      </Flex>
      <Heading size="2" mr="auto">
        Name
      </Heading>
      <TextField.Root
        placeholder="Habit Name"
        defaultValue={habit?.name ?? ''}
        onChange={(e) => setHabitName(e.target.value)}
        mt="1"
      />
      {error && (
        <Heading size="1" color="red" mt="1" align="left">
          {error}
        </Heading>
      )}
      <Heading size="2" mt="3" mb="1" mr="auto">
        Color
      </Heading>
      <ColorSwatchPicker value={habitColor} onChange={setHabitColor} />
      <Flex width="100%" justify="end" gap="2" mt="4">
        <Dialog.Close>
          <Button variant="soft">Cancel</Button>
        </Dialog.Close>
        <Button
          onClick={habit ? onUpdateHabit : onCreateHabit}
          loading={
            habit
              ? updateHabitMutation.isPending
              : createHabitMutation.isPending
          }
          disabled={
            habit
              ? updateHabitMutation.isPending
              : createHabitMutation.isPending
          }
        >
          Save
        </Button>
      </Flex>
    </Flex>
  );
};
