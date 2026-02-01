import {
  Avatar,
  Button,
  Callout,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Routes } from '@/constants';
import {
  fetchUser,
  logout,
  updateEmail,
  updateName,
  updatePassword,
} from '@/requests';

// TODO: nordpass thinks pressing Edit or Cancel counts as logging in
// TODO: show toast on error/success
export const Profile = () => {
  const navigate = useNavigate();

  const { data: user, isError, error } = useQuery(fetchUser);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userEmail = user?.email ?? '';
  const userFirstName = user?.user_metadata?.first_name ?? '';
  const userLastName = user?.user_metadata?.last_name ?? '';

  useMemo(() => {
    setEmail(userEmail);
    setFirstName(userFirstName);
    setLastName(userLastName);
  }, [userEmail, userFirstName, userLastName]);

  const logoutMutation = useMutation(logout);
  const emailMutation = useMutation(updateEmail);
  const nameMutation = useMutation(updateName);
  const passwordMutation = useMutation(updatePassword);

  const onSaveEmail = async () => {
    if (!email || email === userEmail) return;
    try {
      await emailMutation.mutateAsync({ email });
      setIsEditingEmail(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onSaveName = async () => {
    if (firstName === userFirstName && lastName === userLastName) return;
    try {
      await nameMutation.mutateAsync({ firstName, lastName });
      setIsEditingName(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onSavePassword = async () => {
    if (!password || password !== confirmPassword) return;
    try {
      await passwordMutation.mutateAsync({ password });
      setPassword('');
      setConfirmPassword('');
      setIsEditingPassword(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onLogout = async () => {
    try {
      await logoutMutation.mutate();
      navigate(Routes.ROOT);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container size="2">
      <Flex direction="column" gap="4">
        <Heading size="4" align="left">
          Profile
        </Heading>
        {isError && (
          <Callout.Root>
            <Callout.Text>
              {(error as any)?.message ?? 'Failed to load profile.'}
            </Callout.Text>
          </Callout.Root>
        )}
        <Card>
          <Flex align="center" justify="between" gap="4">
            <Flex align="center" gap="3">
              <Avatar
                fallback={userEmail?.[0]?.toUpperCase() ?? '?'}
                radius="full"
                size="3"
              />
              <Text size="3" weight="bold">
                {`${userFirstName} ${userLastName}`}
              </Text>
              <Text color="gray">{userEmail}</Text>
            </Flex>
            <Button variant="outline" onClick={onLogout}>
              Log Out
            </Button>
          </Flex>
        </Card>
        <Grid columns={{ initial: '1', sm: '2' }} gap="4">
          <ProfileForm
            isEditing={isEditingEmail}
            onCancel={() => {
              setIsEditingEmail(false);
              setEmail(userEmail);
            }}
            onConfirm={onSaveEmail}
            onEdit={() => setIsEditingEmail(true)}
            isConfirmDisabled={
              !email || email === userEmail || emailMutation.isPending
            }
            isConfirmLoading={emailMutation.isPending}
          >
            <Heading size="3">Email</Heading>
            <TextField.Root
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              disabled={!isEditingEmail}
            />
          </ProfileForm>
          <ProfileForm
            isEditing={isEditingName}
            onCancel={() => {
              setIsEditingName(false);
              setFirstName(userFirstName);
              setLastName(userLastName);
            }}
            onConfirm={onSaveName}
            onEdit={() => setIsEditingName(true)}
            isConfirmDisabled={
              (firstName === userFirstName && lastName === userLastName) ||
              nameMutation.isPending
            }
            isConfirmLoading={nameMutation.isPending}
          >
            <Heading size="3">Name</Heading>
            <TextField.Root
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditingName}
            />
            <TextField.Root
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditingName}
            />
          </ProfileForm>
          <ProfileForm
            isEditing={isEditingPassword}
            onCancel={() => {
              setIsEditingPassword(false);
              setPassword('');
              setConfirmPassword('');
            }}
            onConfirm={onSavePassword}
            onEdit={() => setIsEditingPassword(true)}
            isConfirmDisabled={
              !password ||
              password !== confirmPassword ||
              passwordMutation.isPending
            }
            isConfirmLoading={passwordMutation.isPending}
          >
            <Heading size="3">Password</Heading>
            <TextField.Root
              placeholder="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isEditingPassword}
            />
            <TextField.Root
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isEditingPassword}
            />
            {password && confirmPassword && password !== confirmPassword && (
              <Text color="red" size="1">
                Passwords do not match.
              </Text>
            )}
          </ProfileForm>
        </Grid>
        {/* <Card>
          <Flex direction="column" gap="3">
            <Heading size="3" color="red">
              Danger Zone
            </Heading>
            <Text color="gray">Sign out of your account.</Text>
            <Flex>
              <SignOutButton />
            </Flex>
          </Flex>
        </Card> */}
      </Flex>
    </Container>
  );
};

const ProfileForm = ({
  children,
  isEditing,
  onCancel,
  onConfirm,
  onEdit,
  isConfirmDisabled = false,
  isConfirmLoading = false,
}: {
  children: React.ReactNode;
  isEditing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onEdit?: () => void;
  isConfirmDisabled?: boolean;
  isConfirmLoading?: boolean;
}) => (
  <Card style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Flex direction="column" gap="3" flexGrow="1">
      {children}
      <Flex gap="3" justify="end" mt="auto">
        {isEditing ? (
          <>
            <Button variant="soft" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isConfirmDisabled}
              loading={isConfirmLoading}
            >
              Confirm
            </Button>
          </>
        ) : (
          <Button variant="soft" onClick={onEdit}>
            Edit
          </Button>
        )}
      </Flex>
    </Flex>
  </Card>
);

// const SignOutButton = () => {
//   const [errorText, setErrorText] = useState<string | null>(null);
//   const onSignOut = async () => {
//     try {
//       setErrorText(null);
//       const { supabase } = await import('@/requests');
//       await supabase.auth.signOut();
//       window.location.href = '/login';
//     } catch (e: any) {
//       setErrorText(e?.message ?? 'Failed to sign out');
//     }
//   };
//   return (
//     <Flex direction="column" gap="2">
//       {errorText && <Text color="red">{errorText}</Text>}
//       <Button color="red" variant="soft" onClick={onSignOut}>
//         Sign Out
//       </Button>
//     </Flex>
//   );
// };
