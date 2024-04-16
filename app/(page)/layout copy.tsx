import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { LocationBar, SearchBar } from "./LocationBar";
import PostButton from "@/components/PostQuoteButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      style={{ background: "#f2f2f2" }}
      w={"full"}
      h={"full"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Flex
        as="nav"
        justify="space-between"
        wrap="wrap"
        padding={5}
        bg="white"
        w={"100%"}
        borderBottom="1px solid black"
      >
        <Flex w="100%" maxW={"2050px"} mx="auto" justify="space-between">
          <Flex>
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={125}
                height={125}
                priority={true}
              />
            </Link>
          </Flex>
          <Flex gap={4}>
            <SearchBar />
            <LocationBar />
          </Flex>
          <Flex
            alignItems={"center"}
          >
            <PostButton />
            <AuthButton />
          </Flex>
        </Flex>
      </Flex>
      <Box w="100%" flex="1" padding={5}>
        {children}
      </Box>
    </Box>
  );
}