import { Button, Container, TextField } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/constants';
import { login as loginRequest } from '@/requests';

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p>login</p>
        <a href="/register">Go to Register</a>
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
          <p style={{ color: 'red' }}>
            {loginMutation.error?.message ??
              'Something went wrong, please try again.'}
          </p>
        )}
        <Button onClick={onSubmit}>Login</Button>
      </div>
    </Container>
  );
};
