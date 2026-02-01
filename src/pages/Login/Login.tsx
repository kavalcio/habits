import {
  Button,
  Callout,
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { FormError } from '@/components';
import { Routes } from '@/constants';
import { login as loginRequest } from '@/requests';

// TODO: add button to show password
// TODO: submit on enter key press
export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation(loginRequest);

  const onSubmit = async () => {
    try {
      const { user } = await loginMutation.mutateAsync({
        email,
        password,
      });
      console.log('user', user);
      if (user) navigate(Routes.DASHBOARD);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container size="1">
      <Flex direction="column" gap="3">
        <Flex align="end" justify="between">
          <Heading size="5">Log in</Heading>
          <Link asChild color="blue" size="2">
            <RouterLink to={Routes.FORGOT_PASSWORD}>
              <Text>Forgot password?</Text>
            </RouterLink>
          </Link>
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
        {loginMutation.isError && (
          <FormError message={loginMutation.error?.message} />
        )}
        <Button
          onClick={onSubmit}
          mb="1"
          loading={loginMutation.isPending}
          disabled={loginMutation.isPending}
        >
          Log in
        </Button>
        <Separator orientation="horizontal" style={{ width: '100%' }} />
        <Text size="2" align="left">
          Don't have an account?{' '}
          <Link asChild color="blue" size="2">
            <RouterLink to={Routes.REGISTER}>
              <Text>Sign up</Text>
            </RouterLink>
          </Link>
        </Text>
      </Flex>
    </Container>
  );
};
