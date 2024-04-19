import { Text } from "@chakra-ui/react";

export const TopTitle = ({ children }: { children: React.ReactNode }) => (
  <Text fontSize={"md"} fontWeight="bold" mb={2}>
    {children}
  </Text>
);

