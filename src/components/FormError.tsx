import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout } from '@radix-ui/themes';

export const FormError = ({ message }: { message: string }) => {
  return (
    <Callout.Root color="red" size="1" variant="surface">
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        {message ?? 'Something went wrong, please try again.'}
      </Callout.Text>
    </Callout.Root>
  );
};
