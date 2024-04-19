import { Box, Stack, Text, Link, Divider, Center } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" py={8} bg="gray.100">
      <Divider mb={8} />
      <Center
        maxW="container.lg"
        mx="auto"
        px={4}
      >
        <Text fontSize="sm" color="gray.600">
          © {new Date().getFullYear()} Fairbids. All rights reserved.
        </Text>
      </Center>
    </Box>
  );
};

export default Footer;