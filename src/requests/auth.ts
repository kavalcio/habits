import { queryClient, supabase } from './supabase';

export const register = {
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
};

export const fetchUser = {
  queryKey: ['user'],
  queryFn: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
};

export const updateEmail = {
  mutationFn: async ({ email }: { email: string }) => {
    const { data, error } = await supabase.auth.updateUser({ email });
    if (error) throw error;
    return data.user;
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
  },
};

export const updatePassword = {
  mutationFn: async ({ password }: { password: string }) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data.user;
  },
};

export const updateName = {
  mutationFn: async ({
    firstName,
    lastName,
  }: {
    firstName: string;
    lastName: string;
  }) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
    });
    if (error) throw error;
    return data.user;
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
  },
};
