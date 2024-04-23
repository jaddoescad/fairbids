import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import PostButton from "@/components/PostQuoteButton";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import MainWrapper from "@/components/wrappers/MainWrapper";
import { LocationBar, SearchBar } from "@/components/LocationBar";
import NavBar from "@/components/NavBar";
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
      <NavBar user={user} name={name}/>
      <MainWrapper>{children}</MainWrapper>
    </Box>
  );
}
