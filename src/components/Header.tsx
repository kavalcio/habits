import {
  HamburgerMenuIcon,
  MoonIcon,
  PersonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Link,
  Popover,
  Text,
} from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Routes } from '@/constants';
import { fetchSession } from '@/requests';

import { DailyLogDialog } from './DailyLogDialog';

export const Header = ({
  isDarkMode,
  setIsDarkMode,
}: {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const { data: session, isPending } = useQuery(fetchSession);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
              style={{
                color: 'inherit',
                textDecoration: 'inherit',
                fontWeight: 600,
                fontSize: 20,
              }}
              to="/"
            >
              temper
            </RouterLink>
          </Text>
          <Flex
            gap="4"
            align="center"
            display={{
              initial: 'none',
              xs: 'flex',
            }}
          >
            <Link asChild>
              <RouterLink to={Routes.DASHBOARD}>
                <Text>Dashboard</Text>
              </RouterLink>
            </Link>
            {session && <DailyLogDialog />}
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
              <IconButton variant="outline" asChild>
                <RouterLink to={Routes.PROFILE}>
                  <PersonIcon />
                </RouterLink>
              </IconButton>
            )}
          </Flex>
          <Flex
            display={{
              initial: 'flex',
              xs: 'none',
            }}
          >
            <Popover.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <Popover.Trigger>
                <IconButton variant="outline" aria-label="Open menu">
                  <HamburgerMenuIcon />
                </IconButton>
              </Popover.Trigger>
              <Popover.Content
                sideOffset={8}
                align="end"
                style={{ minWidth: 180, padding: 12 }}
              >
                <Flex direction="column" gap="3" align="stretch">
                  <Link asChild onClick={() => setIsMenuOpen(false)}>
                    <RouterLink to={Routes.DASHBOARD}>
                      <Text>Dashboard</Text>
                    </RouterLink>
                  </Link>
                  {session && (
                    <Link asChild onClick={() => setIsMenuOpen(false)}>
                      <RouterLink to={Routes.PROFILE}>
                        <Text>Profile</Text>
                      </RouterLink>
                    </Link>
                  )}
                  {session && <DailyLogDialog />}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDarkMode((prev: boolean) => !prev);
                    }}
                  >
                    {isDarkMode ? <SunIcon /> : <MoonIcon />}
                    Switch Theme
                  </Button>
                  {!isPending && !session && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate(Routes.LOGIN);
                      }}
                    >
                      Log In
                    </Button>
                  )}
                </Flex>
              </Popover.Content>
            </Popover.Root>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
