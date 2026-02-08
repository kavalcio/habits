import { Button, Dialog, Flex, Strong, Text } from '@radix-ui/themes';
import { format } from 'date-fns';

import { Event, Habit } from '@/types';
import { getLocalDate } from '@/utils';

// TODO: prevent this dialog from closing when onConfirm fails
export const EditEventDialog = ({
  children,
  date,
  habit,
  event,
  onClose,
  onConfirm,
}: {
  children: React.ReactNode;
  date?: string;
  habit: Habit;
  event?: Event;
  onClose?: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog.Root onOpenChange={(open) => !open && onClose?.()}>
      <Dialog.Content maxWidth="320px">
        <Flex direction="column" align="start">
          <Dialog.Title size="4" align="left">
            {event ? 'Remove' : 'Add'} activity
            {!!habit?.name && (
              <Text>
                {' '}
                for{' '}
                <Strong style={{ color: 'var(--accent-10)' }}>
                  {habit.name}
                </Strong>
              </Text>
            )}
          </Dialog.Title>
          <Dialog.Description size="2" align="left">
            Are you sure you want to {event ? 'remove' : 'add'} activity on{' '}
            <Strong>
              {!!date && format(getLocalDate(date), 'EEE, MMM d, yyyy')}
            </Strong>
            ?
          </Dialog.Description>
          <Flex width="100%" justify="end" gap="2" mt="4">
            <Dialog.Close>
              <Button variant="soft" onClick={onClose}>
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={onConfirm}>Confirm</Button>
            </Dialog.Close>
          </Flex>
        </Flex>
      </Dialog.Content>
      {children}
    </Dialog.Root>
  );
};
