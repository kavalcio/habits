import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { register as registerRequest } from '@/requests';

// TODO: figure out how to resend expired confirmation email
export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const registerMutation = useMutation(registerRequest);

  const onSubmit = async () => {
    try {
      await registerMutation.mutateAsync({ email, password });
      setShowConfirmation(true);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(registerMutation);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {!showConfirmation ? (
        <>
          <p>register</p>
          <a href="/login">Go to Login</a>
          <input
            type="text"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {registerMutation.isError && (
            <p style={{ color: 'red' }}>
              {registerMutation.error?.message ??
                'Something went wrong, please try again.'}
            </p>
          )}
          <button onClick={onSubmit}>Register</button>
        </>
      ) : (
        <p>Please check your email for the confirmation link.</p>
      )}
    </div>
  );
};
