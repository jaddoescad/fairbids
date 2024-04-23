'use client'

import { Box, Flex, Stack, useBreakpointValue } from "@chakra-ui/react";
import HeaderWrapper from "./wrappers/HeaderWrapper";
import Logo from "./Logo";
import { LocationBar, SearchBar } from "./LocationBar";
import AuthButton from "./AuthButton";
import PostButton from "@/components/PostQuoteButton";
import { NavBarProps } from "@/types/types";

export default function NavBar({ user, name }: NavBarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box borderBottom="1px solid black">
      {!isMobile ? (
        <HeaderWrapper>
          <Flex alignItems="center" flexShrink={0}>
            <Logo />
          </Flex>
          <Flex direction={{ base: "column", md: "row" }} gap={4} px={10} alignItems="center">
            <SearchBar />
            <LocationBar />
          </Flex>
          <Flex alignItems={"center"}>
            <PostButton />
            <AuthButton user={user} name={name} />
          </Flex>
        </HeaderWrapper>
      ) : (
        <>
          <HeaderWrapper>
            <Flex alignItems="center" flexShrink={0}>
              <Logo />
            </Flex>
            <Flex alignItems={"center"}>
              <PostButton />
              <AuthButton user={user} name={name} />
            </Flex>
          </HeaderWrapper>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}  px={6} pb={5}>
            <SearchBar />
            <LocationBar />
          </Stack>
        </>
      )}
    </Box>
  );
}
