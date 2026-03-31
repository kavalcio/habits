import { Button, Container, Flex, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';

import { AbacusAnimation } from '@/components';
import { Routes } from '@/constants';
import { fetchSession } from '@/requests';

export const Home = () => {
  const { data: session, isPending } = useQuery(fetchSession);

  return (
    <Container size="3" pt="6">
      <Flex gap="8" direction="column">
        <AbacusAnimation />
        {!isPending && (
          <Flex direction="row" gap="4" align="center" justify="center">
            {session ? (
              <>
                <Button asChild variant="solid">
                  <RouterLink to={Routes.DASHBOARD}>
                    <Text>Enter</Text>
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
    </Container>
  );
};
