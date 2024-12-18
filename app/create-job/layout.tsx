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
    <Box w={"full"} h={"full"} display={"flex"} flexDirection={"column"}>
      <Box px={"20px"}>
      <HeaderWrapper>
        <Flex align="center" mr={5}>
          <Logo />
        </Flex>
        <Spacer />
        <Box>
          <Link href="/">
            <Button size="lg" fontSize="2xl">
              Exit
            </Button>
          </Link>
        </Box>
      </HeaderWrapper>
      </Box>
      <div className="h-full flex flex-col items-center">{children}</div>
    </Box>
  );
}
