import { Button, Container, TextField } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { register as registerRequest } from '@/requests';

// TODO: figure out how to resend expired confirmation email
// TODO: submit on enter key press
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

  console.log(registerMutation);

  return (
    <Container size="1">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!showConfirmation ? (
          <>
            <p>register</p>
            <a href="/login">Go to Login</a>
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
            <Button onClick={onSubmit}>Register</Button>
          </>
        ) : (
          <p>Please check your email for the confirmation link.</p>
        )}
      </div>
    </Container>
  );
};
