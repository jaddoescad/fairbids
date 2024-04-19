import * as React from "react";
import { Box, Flex, Spacer, Button } from "@chakra-ui/react";
import Link from "next/link";
import Logo from "@/components/Logo";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box className="h-full w-full">
      <HeaderWrapper>
        <Flex align="center" mr={5}>
          <Logo />
        </Flex>
        <Spacer />
      </HeaderWrapper>
      <div className="h-full flex flex-col items-center">{children}</div>
    </Box>
  );
}
