import { TrashIcon } from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Dialog,
  Flex,
  IconButton,
  Strong,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';

import {
  addTagsToEvent,
  createEvent,
  createHabitTag,
  deleteEvent,
} from '@/requests';
import { Event, Habit } from '@/types';
import { getLocalDate } from '@/utils';

// TODO: limit tag length to something
// TODO: prevent this dialog from closing when onConfirm fails
export const EditEventDialog = ({
  children,
  date,
  habit,
  event,
  onClose,
}: {
  children: React.ReactNode;
  date?: string;
  habit: Habit;
  event?: Event;
  onClose?: () => void;
}) => {
  const [tagInput, setTagInput] = useState('');
  const [tagsToAdd, setTagsToAdd] = useState<number[]>([]);

  const createEventMutation = useMutation(createEvent);
  const deleteEventMutation = useMutation(deleteEvent);
  const createHabitTagMutation = useMutation(createHabitTag);
  const addTagsToEventMutation = useMutation(addTagsToEvent);

  const onCreateHabitTag = async () => {
    console.log('Creating habit tag with name', tagInput);
    if (!tagInput.trim()) return;
    try {
      await createHabitTagMutation.mutateAsync({
        habitId: habit.id,
        name: tagInput.trim(),
      });
      setTagInput('');
    } catch (error) {
      console.error('Error creating habit tag', error);
    }
  };

  const onSaveEvent = async () => {
    try {
      let eventId = event?.id;
      if (!eventId) {
        if (!date) return;
        const response = await createEventMutation.mutateAsync({
          habitId: habit.id,
          date,
        });
        eventId = response.id;
      }
      if (tagsToAdd.length > 0) {
        await addTagsToEventMutation.mutateAsync({
          eventId: eventId!,
          tagIds: tagsToAdd,
        });
      }
      onClose?.();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const onDeleteEvent = async () => {
    try {
      if (!event) return;
      await deleteEventMutation.mutateAsync(event.id);
      onClose?.();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <Dialog.Root onOpenChange={(open) => !open && onClose?.()}>
      <Dialog.Content maxWidth="420px">
        <Flex direction="column" align="start" gap="3">
          <Flex direction="row" align="center" width="100%">
            <Dialog.Title size="4" align="left" mb="0">
              {/* {event ? 'Remove' : 'Add'} activity
              {!!habit?.name && (
                <Text>
                  {' '}
                  for{' '}
                  <Strong style={{ color: 'var(--accent-10)' }}>
                    {habit.name}
                  </Strong>
                </Text>
              )} */}
              {event ? 'Edit' : 'Add'} activity
            </Dialog.Title>
            {!!event && (
              <Dialog.Close>
                <IconButton
                  size="1"
                  variant="soft"
                  color="red"
                  ml="auto"
                  onClick={onDeleteEvent}
                >
                  <TrashIcon />
                </IconButton>
              </Dialog.Close>
            )}
          </Flex>
          <Text>Habit</Text>
          <Strong style={{ color: 'var(--accent-10)' }}>{habit.name}</Strong>

          <Text>Tags</Text>
          <TextField.Root
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <Button onClick={onCreateHabitTag}>Add Tag</Button>
          {/* <Flex gap="2" wrap="wrap">
            {event?.event_tag.map((et) => (
              <Text key={et.id} size="2" color="gray">
                {event.habit_tag.find((ht) => ht.id === et.habit_tag_id)?.name}
              </Text>
            ))}
          </Flex> */}
          <Text>Available tags</Text>
          <Flex gap="2" wrap="wrap">
            {habit.habit_tag.map((ht) => (
              <Button
                key={ht.id}
                size="2"
                onClick={() => {
                  if (tagsToAdd.includes(ht.id)) {
                    setTagsToAdd((prev) => prev.filter((id) => id !== ht.id));
                  } else {
                    setTagsToAdd((prev) => [...prev, ht.id]);
                  }
                }}
              >
                <Text size="2" color="gray">
                  {ht.name}
                </Text>
              </Button>
            ))}
          </Flex>
          <Dialog.Description size="2" align="left">
            Are you sure you want to {event ? 'remove' : 'add'} activity on{' '}
            <Strong>
              {!!date && format(getLocalDate(date), 'EEE, MMM d, yyyy')}
            </Strong>
            ?
          </Dialog.Description>
          <Flex width="100%" justify="end" gap="2" mt="4">
            {/* {!!event && (
              <Dialog.Close>
                <Button
                  color="red"
                  variant="soft"
                  onClick={onDeleteEvent}
                  mr="auto"
                >
                  <TrashIcon />
                  Delete
                </Button>
              </Dialog.Close>
            )} */}
            <Dialog.Close>
              <Button variant="soft" onClick={onClose}>
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={onSaveEvent}>{event ? 'Add' : 'Update'}</Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
      {children}
    </Dialog.Root>
  );
};
