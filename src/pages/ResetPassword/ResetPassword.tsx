import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import {
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormError } from '@/components';
import { Routes } from '@/constants';
import {
  fetchSession,
  updatePassword as updatePasswordRequest,
} from '@/requests';

// TODO: dont allow access to this page if not logged in
export const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { data: session, isPending } = useQuery(fetchSession);
  const updatePasswordMutation = useMutation(updatePasswordRequest);

  const onSubmit = async () => {
    try {
      setFormError('');
      if (!password || password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }
      await updatePasswordMutation.mutateAsync({ password });
      enqueueSnackbar('Password updated successfully.', { variant: 'success' });
      navigate(Routes.DASHBOARD, { replace: true });
    } catch (error) {
      setFormError((error as Error)?.message ?? 'Something went wrong.');
      console.error(error);
    }
  };

  return (
    <Container size="1">
      <Flex direction="column" gap="3">
        {isPending ? (
          <Spinner />
        ) : session ? (
          <>
            <Flex align="end" justify="start">
              <Heading size="5">Reset Password</Heading>
            </Flex>
            <Flex direction="row" align="center" gap="2">
              <TextField.Root
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
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
              placeholder="Confirm new password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFormError('');
              }}
            />
            {!!formError && <FormError message={formError} />}
            <Button
              onClick={onSubmit}
              mb="1"
              loading={updatePasswordMutation.isPending}
              disabled={updatePasswordMutation.isPending}
            >
              Update
            </Button>
          </>
        ) : (
          <Text>
            Your password reset link is invalid or has expired.
            <br />
            Please request a new password reset.
          </Text>
        )}
      </Flex>
    </Container>
  );
};
