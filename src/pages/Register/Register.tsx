import {
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { register as registerRequest } from '@/requests';

// TODO: figure out how to resend expired confirmation email
export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerMutation = useMutation(registerRequest);

  const onSubmit = async () => {
    try {
      if (password !== confirmPassword) {
        // TODO: show error
        // return;
      }

      await registerMutation.mutateAsync({ email, password });
      setShowConfirmation(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container size="1">
      <Flex direction="column" gap="3">
        {!showConfirmation ? (
          <>
            <Flex align="end" justify="start">
              <Heading size="5">Sign up</Heading>
            </Flex>
            <TextField.Root
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField.Root
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField.Root
              type="password"
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {registerMutation.isError && (
              <p style={{ color: 'red' }}>
                {registerMutation.error?.message ??
                  'Something went wrong, please try again.'}
              </p>
            )}
            <Button onClick={onSubmit} mb="1">
              Sign up
            </Button>
            <Separator orientation="horizontal" style={{ width: '100%' }} />
            <Text size="2" align="left">
              Already an account?{' '}
              <Link asChild color="blue" size="2">
                <RouterLink to="/login">
                  <Text>Log in</Text>
                </RouterLink>
              </Link>
            </Text>
          </>
        ) : (
          <Text>Please check your email for the confirmation link.</Text>
        )}
      </Flex>
    </Container>
  );
};
