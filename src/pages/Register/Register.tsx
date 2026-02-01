import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import {
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { FormError } from '@/components';
import { Routes } from '@/constants';
import { register as registerRequest } from '@/requests';

// TODO: figure out how to resend expired confirmation email
export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useMutation(registerRequest);

  const onSubmit = async () => {
    try {
      setFormError('');
      if (!password || password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
      await registerMutation.mutateAsync({ email, password });
      setShowConfirmation(true);
    } catch (error) {
      setFormError((error as Error)?.message ?? 'Something went wrong.');
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
              autoComplete="off"
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError('');
              }}
            />
            <Flex direction="row" align="center" gap="2">
              <TextField.Root
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormError('');
                }}
                style={{ flex: 1 }}
              />
              <IconButton
                variant="soft"
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                size="2"
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </IconButton>
            </Flex>
            <TextField.Root
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="confirm password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFormError('');
              }}
            />
            {!!formError && <FormError message={formError} />}
            <Button
              onClick={onSubmit}
              mb="1"
              loading={registerMutation.isPending}
              disabled={registerMutation.isPending}
            >
              Sign up
            </Button>
            <Separator orientation="horizontal" style={{ width: '100%' }} />
            <Text size="2" align="left">
              Already an account?{' '}
              <Link asChild color="blue" size="2">
                <RouterLink to={Routes.LOGIN}>
                  <Text>Log in</Text>
                </RouterLink>
              </Link>
            </Text>
          </>
        ) : (
          <>
            <Text>Please check your email for the confirmation link.</Text>
          </>
        )}
      </Flex>
    </Container>
  );
};
