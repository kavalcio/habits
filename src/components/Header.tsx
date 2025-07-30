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
import { Link as RouterLink } from 'react-router-dom';

// TODO: collapse into hamburger on mobile
export const Header = ({
  isDarkMode,
  setIsDarkMode,
}: {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
              to="/dashboard"
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
            {/* <Text>Today</Text> */}
            <Link asChild>
              <RouterLink to="/profile">
                <Text>Profile</Text>
              </RouterLink>
            </Link>
            <IconButton
              variant="ghost"
              onClick={() => setIsDarkMode((prev: boolean) => !prev)}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </IconButton>
            {/* TODO: show login if already logged out */}
            <Button variant="outline">Log Out</Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
