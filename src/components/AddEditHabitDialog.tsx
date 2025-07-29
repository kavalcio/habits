import { Button, Dialog, Flex, Heading, TextField } from '@radix-ui/themes';
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
          <Dialog.Title mr="auto">{habit ? 'Edit' : 'Add'} Habit</Dialog.Title>
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
          {/* <Card mt="3">
            <Heading color="red" size="2" mb="2">
              Danger Zone
            </Heading>
            <Button>Delete Habit</Button>
          </Card> */}
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
