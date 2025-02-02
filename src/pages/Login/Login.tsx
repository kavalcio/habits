import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/constants';
import { supabase } from '@/requests';

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
  });

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

  // console.log(loginMutation);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p>login</p>
      <a href="/register">Go to Register</a>
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
      {loginMutation.isError && (
        <p style={{ color: 'red' }}>
          {loginMutation.error?.message ??
            'Something went wrong, please try again.'}
        </p>
      )}
      <button onClick={onSubmit}>Login</button>
    </div>
  );
};
