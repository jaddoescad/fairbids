'use client'

import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import HeaderWrapper from "./wrappers/HeaderWrapper";
import Logo from "./Logo";
import { LocationBar, SearchBar } from "./LocationBar";
import AuthButton from "./AuthButton";
import PostButton from "@/components/PostQuoteButton";
import { NavBarProps } from "@/types/types";

export default function NavBar({ user, name }: NavBarProps) {
  const isMobile = useBreakpointValue({ base: true, md: false }, {ssr: false});

  return (
    <Box borderBottom="1px solid black" px={"20px"}>
      <HeaderWrapper>
        <Flex alignItems="center" flexShrink={0}>
          <Logo />
        </Flex>
        {!isMobile && (
          <Flex direction={{ base: "column", md: "row" }} gap={4} px={10} alignItems="center">
            <SearchBar />
            <LocationBar />
          </Flex>
        )}
        <Flex alignItems={"center"}>
          <PostButton />
          <AuthButton user={user} name={name} />
        </Flex>
      </HeaderWrapper>
      {isMobile && (
        <Flex direction="column" gap={4} px={6} pb={5}>
          <SearchBar />
          <LocationBar />
        </Flex>
      )}
    </Box>
  );
}