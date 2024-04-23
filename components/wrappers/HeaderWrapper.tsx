import * as React from "react";
import { Flex } from "@chakra-ui/react";

export default function HeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
      as="nav"
      justify="space-between"
      wrap="wrap"
      padding={5}
      bg="white"
      w={"100%"}
    >
      <Flex w="100%" maxW={"1800px"} mx="auto" justify="space-between">
        {children}
      </Flex>
    </Flex>
  );
}
