import { Text } from "@chakra-ui/react";

export const TopTitle = ({ children }: { children: React.ReactNode }) => (
  <Text fontSize={"x-large"} fontWeight="bold" mb={2}>
    {children}
  </Text>
);

