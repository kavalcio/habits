import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import {
  Button,
  Callout,
  Container,
  Flex,
  Heading,
  Text,
} from '@radix-ui/themes';
import { Link as RouterLink } from 'react-router-dom';

import { Routes } from '@/constants';

export const NotFound = () => {
  return (
    <Container size="2">
      <Flex direction="column" gap="5" align="center" py="9">
        <Heading size="8" weight="bold" style={{ lineHeight: 1 }}>
          404
        </Heading>
        <Flex direction="column" gap="2" align="center">
          <Heading as="h2" size="4" weight="medium">
            Page not found
          </Heading>
          <Text size="3" color="gray" align="center">
            The address may be misspelled or the page may have moved.
          </Text>
        </Flex>
        <Callout.Root color="gray" variant="surface" style={{ maxWidth: 420 }}>
          <Callout.Icon>
            <QuestionMarkCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            <Text size="2" color="gray">
              If you followed a link from somewhere else, you can head home and
              try again from there.
            </Text>
          </Callout.Text>
        </Callout.Root>
        <Button asChild size="3" variant="solid">
          <RouterLink to={Routes.ROOT}>
            <Text>Back to home</Text>
          </RouterLink>
        </Button>
      </Flex>
    </Container>
  );
};
