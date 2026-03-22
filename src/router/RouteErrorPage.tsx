import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Callout,
  Code,
  Container,
  Flex,
  Heading,
  Text,
  Theme,
} from '@radix-ui/themes';
import {
  isRouteErrorResponse,
  Link as RouterLink,
  useRouteError,
} from 'react-router-dom';

import { Routes } from '@/constants';

/** Same defaults as `AppLoader` — error UI mounts outside that tree when React Router catches a render error. */
function readStoredAppearance(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme');
  if (stored === 'light') return 'light';
  if (stored === 'dark') return 'dark';
  return 'dark';
}

function errorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return (
      error.statusText || error.data?.toString?.() || 'Something went wrong'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

function errorTitle(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return 'Not found';
    }
    return `Error ${error.status}`;
  }
  return 'Something went wrong';
}

export const RouteErrorPage = () => {
  const error = useRouteError();
  const message = errorMessage(error);
  const title = errorTitle(error);
  const stack = error instanceof Error ? error.stack : undefined;

  return (
    <Theme
      appearance={readStoredAppearance()}
      accentColor="grass"
      panelBackground="solid"
      radius="large"
    >
      <Box m={{ initial: '4', sm: '6' }}>
        <Container size="2">
          <Flex direction="column" gap="5" align="stretch" py="8">
            <Flex direction="column" gap="2">
              <Heading size="6" weight="bold">
                {title}
              </Heading>
              <Text size="3" color="gray">
                The app hit a problem loading this screen.
              </Text>
            </Flex>
            <Callout.Root color="red" variant="surface">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>
                <Text size="2" weight="medium">
                  {message}
                </Text>
              </Callout.Text>
            </Callout.Root>
            {import.meta.env.DEV && stack ? (
              <Code
                size="2"
                variant="ghost"
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {stack}
              </Code>
            ) : null}
            <Flex gap="3" wrap="wrap" align="center" justify="center">
              <Button asChild variant="outline">
                <RouterLink to={Routes.ROOT}>
                  <Text>Back to home</Text>
                </RouterLink>
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Theme>
  );
};
