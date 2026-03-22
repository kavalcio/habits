import {
  Button,
  Container,
  Flex,
  Heading,
  Separator,
  Text,
} from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';

import { AbacusAnimation } from '@/components';
import { Routes } from '@/constants';
import { fetchSession } from '@/requests';

export const Home = () => {
  const { data: session, isPending } = useQuery(fetchSession);

  return (
    <Container size="3" pt="6">
      <Flex
        direction={{
          initial: 'column',
          sm: 'row',
        }}
        gap="8"
      >
        <Flex direction="column" gap="5" flexGrow="1">
          <Heading size="6">Welcome to Ordo</Heading>
          <Text size="3" color="gray">
            Ordo is a habit tracking app designed to help you build, monitor,
            and maintain positive routines. Track your progress, visualize your
            streaks, and stay motivated every day.
          </Text>
          <Separator style={{ width: '100%' }} />
          {!isPending && (
            <Flex direction="row" gap="4" align="center" justify="center">
              {session ? (
                <>
                  <Button asChild variant="solid">
                    <RouterLink to={Routes.DASHBOARD}>
                      <Text>Go to Dashboard</Text>
                    </RouterLink>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="solid">
                    <RouterLink to={Routes.LOGIN}>
                      <Text>Log In</Text>
                    </RouterLink>
                  </Button>
                  <Button asChild variant="outline">
                    <RouterLink to={Routes.REGISTER}>
                      <Text>Sign Up</Text>
                    </RouterLink>
                  </Button>
                </>
              )}
            </Flex>
          )}
        </Flex>
        <Flex flexShrink="1">
          <AbacusAnimation />
        </Flex>
      </Flex>
    </Container>
  );
};
