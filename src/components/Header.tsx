import { Box, Container, Flex, Link, Text } from '@radix-ui/themes';
import { Link as RouterLink } from 'react-router-dom';

// TODO: collapse into hamburger on mobile
export const Header = () => {
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
          <Text>Temper</Text>
          <Flex gap="4" align="center">
            <Link asChild>
              <RouterLink to="/dashboard">
                <Text>Dashboard</Text>
              </RouterLink>
            </Link>
            <Text>Today</Text>
            <Text>Profile</Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
