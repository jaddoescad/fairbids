import * as React from "react";
import { Flex } from "@chakra-ui/react";
import AuthButton from "@/components/AuthButton";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import Logo from "@/components/Logo";
import PostButton from "@/components/PostQuoteButton";
import { LocationBar, SearchBar } from "@/components/LocationBar";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getUserDisplayName } from "@/utils/getName";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }} = await supabase.auth.getUser();
  const name = getUserDisplayName(user);

  return (
    <div style={{ background: "#f2f2f2" }} className="w-full flex flex-col items-center">
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
      <div style={{ maxWidth: "2050px", width: "100%" }}>{children}</div>
    </div>
  );
}