import { Cross2Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Popover,
  Strong,
  Table,
  Text,
  TextField,
  Theme,
  Tooltip,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';

import {
  addTagsToEvent,
  createEvent,
  createHabitTag,
  deleteEvent,
  removeTagsFromEvent,
} from '@/requests';
import { Event, Habit } from '@/types';
import { getLocalDate } from '@/utils';

export const EditEventDialog = ({
  onClose,
  children,
  ...args
}: {
  children: React.ReactNode;
  date?: string;
  habit: Habit;
  event?: Event;
  onClose?: () => void;
}) => {
  return (
    <Dialog.Root onOpenChange={(open) => !open && onClose?.()}>
      <Dialog.Content maxWidth="420px">
        <EditEventDialogContent {...args} onClose={onClose} />
      </Dialog.Content>
      {children}
    </Dialog.Root>
  );
};

export const EditEventDialogContent = ({
  date,
  habit,
  event,
  onClose,
}: {
  date?: string;
  habit: Habit;
  event?: Event;
  onClose?: () => void;
}) => {
  const [tagInput, setTagInput] = useState('');
  const [tagInputDebounced, setTagInputDebounced] = useState('');

  const [eventTags, setEventTags] = useState<
    { eventTagId: number | null; habitTagId: number; label: string }[]
  >(
    event
      ? (event.event_tag.map((et) => ({
          eventTagId: et.id,
          habitTagId: et.habit_tag_id,
          label:
            habit.habit_tag.find((ht) => ht.id === et.habit_tag_id)?.name ?? '',
        })) ?? [])
      : [],
  );

  const createEventMutation = useMutation(createEvent);
  const deleteEventMutation = useMutation(deleteEvent);
  const createHabitTagMutation = useMutation(createHabitTag);
  const addTagsToEventMutation = useMutation(addTagsToEvent);
  const removeTagsFromEventMutation = useMutation(removeTagsFromEvent);

  const addTagToList = (habitTagId: number, label: string) => {
    const tagAlreadyInList = eventTags.some(
      (et) => et.habitTagId === habitTagId,
    );
    if (tagAlreadyInList) return;
    setEventTags((prev) => [...prev, { eventTagId: null, habitTagId, label }]);
  };

  const removeTagFromList = (habitTagId: number) => {
    setEventTags((prev) => prev.filter((tag) => tag.habitTagId !== habitTagId));
  };

  const onCreateHabitTag = async () => {
    if (!tagInput.trim()) return;
    const tagNotUnique = habit.habit_tag.some(
      (t) => t.name.toLowerCase() === tagInput.trim().toLowerCase(),
    );
    if (tagNotUnique) {
      enqueueSnackbar('Tag with this name already exists', {
        variant: 'warning',
      });
      return;
    }
    try {
      const habitTag = await createHabitTagMutation.mutateAsync({
        habitId: habit.id,
        name: tagInput.trim(),
      });

      // Queue up the new tag to be added to event
      setEventTags((prev) => [
        ...prev,
        { eventTagId: null, habitTagId: habitTag.id, label: habitTag.name },
      ]);

      setTagInput('');
      setTagInputDebounced('');
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

      // Parse through eventTags. All tags with eventTagId null are new -> publish those.
      // Find the diff between the event.event_tag array and the eventTags array. Any missing in eventTags are to be deleted -> delete those
      const tagsToBeAdded = eventTags.filter(
        (tag) =>
          tag.eventTagId === null &&
          !event?.event_tag.some((et) => et.habit_tag_id === tag.habitTagId),
      );
      if (tagsToBeAdded.length > 0) {
        await addTagsToEventMutation.mutateAsync({
          eventId: eventId!,
          habitTagIds: tagsToBeAdded.map((tag) => tag.habitTagId),
        });
      }
      const tagsToBeDeleted =
        event?.event_tag
          .filter(
            (et) =>
              !eventTags.some((tag) => tag.habitTagId === et.habit_tag_id),
          )
          .map((et) => ({ eventTagId: et.id })) ?? [];
      if (tagsToBeDeleted.length > 0) {
        await removeTagsFromEventMutation.mutateAsync({
          eventTagIds: tagsToBeDeleted.map((tag) => tag.eventTagId!),
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

  useEffect(() => {
    if (tagInput === '') {
      setTagInputDebounced(tagInput);
      return;
    }
    const handler = setTimeout(() => {
      setTagInputDebounced(tagInput);
    }, 200);
    return () => {
      clearTimeout(handler);
    };
  }, [tagInput]);

  const filteredHabitTags = useMemo(() => {
    return habit.habit_tag.filter(
      (t) =>
        t.name.toLowerCase().indexOf(tagInputDebounced.toLowerCase()) !== -1 &&
        !eventTags.some((et) => et.habitTagId === t.id),
    );
  }, [habit.habit_tag, tagInputDebounced, eventTags]);

  console.log('eventTags', eventTags);

  const dateString = date ?? event?.date;

  return (
    <Theme accentColor={habit.color as any}>
      <Flex direction="column" align="start" gap="3">
        <Flex direction="row" align="center" width="100%">
          <Dialog.Title size="4" align="left" mb="0">
            {event ? 'Edit' : 'Add'} activity
          </Dialog.Title>
          {!!event && (
            <Dialog.Close>
              <IconButton
                size="1"
                variant="soft"
                ml="auto"
                onClick={onDeleteEvent}
              >
                <TrashIcon />
              </IconButton>
            </Dialog.Close>
          )}
        </Flex>
        <Table.Root style={{ width: '100%' }} size="2">
          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell width="10px">
                <Strong>Habit</Strong>
              </Table.RowHeaderCell>
              <Table.Cell>
                <Strong style={{ color: 'var(--accent-10)' }}>
                  {habit.name}
                </Strong>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell width="10px">
                <Strong>Date</Strong>
              </Table.RowHeaderCell>
              <Table.Cell>
                {dateString &&
                  format(getLocalDate(dateString), 'EEE, MMM dd, yyyy')}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell width="10px">
                <Strong>Tags</Strong>
              </Table.RowHeaderCell>
              <Table.Cell>
                <Flex gap="2" wrap="wrap">
                  <Popover.Root>
                    <Popover.Trigger>
                      <IconButton variant="soft" color="gray" size="1">
                        <PlusIcon />
                      </IconButton>
                    </Popover.Trigger>
                    <Popover.Content>
                      <TextField.Root
                        size="1"
                        placeholder="Search or add tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        mb="3"
                      />
                      <Flex gap="2" wrap="wrap">
                        {!tagInput && filteredHabitTags.length === 0 && (
                          <Text color="gray" size="1">
                            No tags found
                          </Text>
                        )}
                        {!!tagInput && filteredHabitTags.length === 0 && (
                          <Button
                            variant="soft"
                            size="1"
                            onClick={onCreateHabitTag}
                          >
                            <PlusIcon />
                            Create {tagInput}
                          </Button>
                        )}
                        {filteredHabitTags.map((ht) => (
                          <Button
                            key={ht.id}
                            size="1"
                            variant="soft"
                            onClick={() => addTagToList(ht.id, ht.name)}
                          >
                            <Text size="2" color="gray">
                              {ht.name}
                            </Text>
                          </Button>
                        ))}
                      </Flex>
                    </Popover.Content>
                  </Popover.Root>
                  {eventTags.map((tag) => (
                    <Button
                      key={tag.habitTagId}
                      size="1"
                      variant="soft"
                      onClick={() => removeTagFromList(tag.habitTagId)}
                      style={{
                        display: 'flex',
                        paddingRight: 6,
                        gap: 6,
                      }}
                    >
                      <Text size="2">{tag.label}</Text>
                      <Cross2Icon />
                    </Button>
                  ))}
                </Flex>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
        <Flex width="100%" justify="end" gap="2" mt="4">
          <Dialog.Close>
            <Button variant="soft" onClick={onClose}>
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={onSaveEvent}>{event ? 'Update' : 'Add'}</Button>
          </Dialog.Close>
        </Flex>
      </Flex>
    </Theme>
  );
};
