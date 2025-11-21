import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Link,
  Text,
} from '@radix-ui/themes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Routes } from '@/constants';
import { fetchSession, logout } from '@/requests';

import { DailyLogDialog } from './DailyLogDialog';

// TODO: collapse into hamburger on mobile
export const Header = ({
  isDarkMode,
  setIsDarkMode,
}: {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const logoutMutation = useMutation(logout);
  const { data: session, isPending } = useQuery(fetchSession);

  return (
    <Box
      position="sticky"
      top="0"
      px={{ initial: '4', sm: '6' }}
      py="4"
      style={{
        backgroundColor: 'var(--gray-1)',
        zIndex: 1,
        borderBottom: '1px solid var(--gray-4)',
      }}
    >
      <Container>
        <Flex justify="between" align="center" gap="4">
          <Text asChild>
            <RouterLink
              style={{ color: 'inherit', textDecoration: 'inherit' }}
              to="/"
            >
              Temper
            </RouterLink>
          </Text>
          <Flex gap="4" align="center">
            <Link asChild>
              <RouterLink to="/dashboard">
                <Text>Dashboard</Text>
              </RouterLink>
            </Link>
            <Link asChild>
              <RouterLink to="/profile">
                <Text>Profile</Text>
              </RouterLink>
            </Link>
            <DailyLogDialog />
            <IconButton
              variant="outline"
              onClick={() => setIsDarkMode((prev: boolean) => !prev)}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </IconButton>
            {!isPending && !session && (
              <Button variant="outline" onClick={() => navigate(Routes.LOGIN)}>
                Log In
              </Button>
            )}
            {session && (
              <Button variant="outline" onClick={() => logoutMutation.mutate()}>
                Log Out
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
