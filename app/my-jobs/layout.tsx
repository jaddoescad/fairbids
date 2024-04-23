import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import AuthButton from "@/components/AuthButton";
import PostButton from "@/components/PostQuoteButton";
import Logo from "@/components/Logo";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import MainWrapper from "@/components/wrappers/MainWrapper";
import { LocationBar, SearchBar } from "@/components/LocationBar";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUserDisplayName } from "@/utils/getName";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }} = await supabase.auth.getUser();
  const name = getUserDisplayName(user);

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
          <AuthButton user={user} name={name} />
        </Flex>
      </HeaderWrapper>
      <MainWrapper>
        {children}
      </MainWrapper>
    </Box>
  );
}