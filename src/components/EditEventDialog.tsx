import { Button, Dialog, Flex, Strong } from '@radix-ui/themes';
import { format } from 'date-fns';

import { getLocalDate } from '@/utils';

export const EditEventDialog = ({
  children,
  date,
  isEventCompleted,
  onClose,
  onConfirm,
}: {
  children: React.ReactNode;
  date?: string;
  isEventCompleted: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Dialog.Root onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content maxWidth="320px">
        <Flex direction="column" align="start">
          <Dialog.Title size="4">
            {isEventCompleted ? 'Remove' : 'Add'} Activity
          </Dialog.Title>
          <Dialog.Description size="2" align="left">
            Are you sure you want to {isEventCompleted ? 'remove' : 'add'}{' '}
            activity on{' '}
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
