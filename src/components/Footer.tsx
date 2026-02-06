import { Container, Flex, Separator, Text } from '@radix-ui/themes';

export const Footer = () => {
  return (
    <Container size="3" pt="8" mb="4">
      <Separator orientation="horizontal" size="4" />
      <Flex p="4" justify="center">
        <Text size="1" color="gray">
          &copy; {new Date().getFullYear()} Sarp Kavalcioglu. All rights
          reserved.
        </Text>
      </Flex>
    </Container>
  );
};
