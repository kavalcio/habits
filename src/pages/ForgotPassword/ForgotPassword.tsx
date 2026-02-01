import {
  Button,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { resetPassword as resetPasswordRequest } from '@/requests';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const resetPasswordMutation = useMutation(resetPasswordRequest);

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await resetPasswordMutation.mutateAsync({ email });
      setShowConfirmation(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container size="1">
      {!showConfirmation ? (
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="3">
            <Flex align="end" justify="start">
              <Heading size="5">Forgot Password</Heading>
            </Flex>
            <TextField.Root
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            {resetPasswordMutation.isError && (
              <p style={{ color: 'red' }}>
                {resetPasswordMutation.error?.message ??
                  'Something went wrong, please try again.'}
              </p>
            )}
            <Button
              type="submit"
              mb="1"
              loading={resetPasswordMutation.isPending}
              disabled={resetPasswordMutation.isPending}
            >
              Reset
            </Button>
          </Flex>
        </form>
      ) : (
        <Text>
          If an account with that email exists, a password reset link has been
          sent.
          <br />
          Please check your email.
        </Text>
      )}
    </Container>
  );
};
