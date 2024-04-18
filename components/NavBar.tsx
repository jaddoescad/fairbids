import { Box, Flex, Stack } from "@chakra-ui/react";
import HeaderWrapper from "./wrappers/HeaderWrapper";
import Logo from "./Logo";
import { LocationBar, SearchBar } from "./LocationBar";
import AuthButton from "./AuthButton";
import PostButton from "@/components/PostQuoteButton";

export default function NavBar() {
  return (
    <>
      <HeaderWrapper>
        <Flex>
          <Logo />
        </Flex>
        <Stack direction={{ base: "column", md: "row" }} spacing={4} ml={4}>
          <SearchBar />
          <LocationBar />
        </Stack>
        <Flex alignItems={"center"}>
          <PostButton />
          <AuthButton />
        </Flex>
      </HeaderWrapper>
    </>
  );
}
