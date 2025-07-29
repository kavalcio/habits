import { TrashIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  Button,
  Dialog,
  Flex,
  Heading,
  IconButton,
  TextField,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/constants';
import { archiveHabit, createHabit, updateHabit } from '@/requests';
import { Tables } from '@/types';

export const AddEditHabitDialog = ({
  children,
  habit,
}: {
  children: React.ReactNode;
  habit?: Tables<'habit'>;
}) => {
  const navigate = useNavigate();

  const [habitName, setHabitName] = useState<string>();
  const [habitColor, setHabitColor] = useState<string>();

  const createHabitMutation = useMutation(createHabit);
  const updateHabitMutation = useMutation(updateHabit);
  const archiveHabitMutation = useMutation(archiveHabit);

  const onCreateHabit = async () => {
    await createHabitMutation.mutateAsync({
      name: habitName,
      color: habitColor,
    });
  };

  const onUpdateHabit = async () => {
    // TODO: validate inputs
    await updateHabitMutation.mutateAsync({
      id: habit.id!,
      name: habitName!,
      color: habitColor!,
    });
  };

  const onArchiveHabit = async () => {
    await archiveHabitMutation.mutateAsync(habit.id);
    navigate(Routes.DASHBOARD, { replace: true });
  };

  return (
    <Dialog.Root>
      <Dialog.Content maxWidth="400px">
        <Flex direction="column">
          <Flex>
            <Dialog.Title mr="auto">
              {habit ? 'Edit' : 'Add'} Habit
            </Dialog.Title>
            <AlertDialog.Root>
              <AlertDialog.Content>
                <Flex direction="column" align="start" gap="2">
                  <AlertDialog.Title>
                    Are you sure you want to archive this habit?
                  </AlertDialog.Title>
                  <AlertDialog.Description size="2" align="left">
                    This will remove the habit from your dashboard and archive
                    it. You can restore it later if needed.
                  </AlertDialog.Description>
                  <Flex width="100%" justify="end" gap="2" mt="4">
                    <AlertDialog.Cancel>
                      <Button variant="soft">Cancel</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button color="red" onClick={onArchiveHabit}>
                        <TrashIcon />
                        Archive Habit
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </Flex>
              </AlertDialog.Content>
              <AlertDialog.Trigger>
                <IconButton size="1" variant="soft">
                  <TrashIcon />
                </IconButton>
              </AlertDialog.Trigger>
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
          <Heading size="2" mt="3" mb="1" mr="auto">
            Color
          </Heading>
          <HexColorPicker color={habitColor} onChange={setHabitColor} />
          <Flex width="100%" justify="end" gap="2" mt="4">
            <Dialog.Close>
              <Button variant="soft">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={habit ? onUpdateHabit : onCreateHabit}>
                Save
              </Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
      {children}
    </Dialog.Root>
  );
};
