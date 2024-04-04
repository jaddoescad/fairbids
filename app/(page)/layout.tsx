import * as React from "react";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { LocationBar, SearchBar } from "./LocationBar";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import PostButton from "@/components/PostQuoteButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();

  const canInitSupabaseClient = () => {
    try {
      createClient(cookieStore);
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();


  return (
    <div
      style={{ background: "#f2f2f2" }}
      className="w-full flex flex-col items-center"
    >
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg="white"
        w={"100%"}
        borderBottom="1px solid black"
      >
        <Flex w="100%" maxW={"2050px"} mx="auto" justify="space-between">
          <Flex>
            <Link href="/">
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={125}
                height={125}
                priority={true}
              />
            </Link>
          </Flex>
          <Flex align="center" gap={4}>
            <SearchBar />
            <LocationBar />
          </Flex>
          <Flex>
            {isSupabaseConnected && <PostButton />}

            <AuthButton />
          </Flex>
        </Flex>
      </Flex>
      <div style={{ maxWidth: "2050px", width: "100%" }}>{children}</div>
    </div>
  );
}