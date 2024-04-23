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
      py={5}
      w={"100%"}
      maxW={"2050px"}
      mx={"auto"}
    >
      <Flex w="100%" mx="auto" justify="space-between">
        {children}
      </Flex>
    </Flex>
  );
}
