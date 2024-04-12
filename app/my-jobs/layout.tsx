import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import AuthButton from "@/components/AuthButton";
import { LocationBar, SearchBar } from "./LocationBar";
import PostButton from "@/components/PostQuoteButton";
import Logo from "@/components/Logo";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import MainWrapper from "@/components/wrappers/MainWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box w={"full"} h={"full"} display={"flex"} flexDirection={"column"}>
      <HeaderWrapper>
        <Flex>
          <Logo />
        </Flex>
        <Flex gap={4}>
          <SearchBar />
          <LocationBar />
        </Flex>
        <Flex alignItems={"center"}>
          <PostButton />
          <AuthButton />
        </Flex>
      </HeaderWrapper>
      <MainWrapper>
        {children}
      </MainWrapper>
    </Box>
  );
}