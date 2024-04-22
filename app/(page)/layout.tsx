import * as React from "react";
import { Box } from "@chakra-ui/react";
import MainWrapper from "@/components/wrappers/MainWrapper";
import NavBar from "@/components/NavBar";
import Footer from '@/components/Footer';
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
      <Footer />
    </Box>
  );
}