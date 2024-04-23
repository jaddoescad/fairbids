import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import AuthButton from "@/components/AuthButton";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import Logo from "@/components/Logo";
import PostButton from "@/components/PostQuoteButton";
import { LocationBar, SearchBar } from "@/components/LocationBar";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUserDisplayName } from "@/utils/getName";
import NavBar from "@/components/NavBar";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }} = await supabase.auth.getUser();
  const name = getUserDisplayName(user);

  return (
    <Box w={"full"} h={"full"} display={"flex"} flexDirection={"column"}>
      <NavBar user={user} name={name} />
      <div style={{ maxWidth: "2050px", width: "100%" }}>{children}</div>
    </Box>
  );
}