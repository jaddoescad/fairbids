import * as React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { LocationBar, SearchBar } from "./LocationBar";
import PostButton from "@/components/PostQuoteButton";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import MainWrapper from "@/components/wrappers/MainWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      w={"full"}
      h={"full"}
      display={"flex"}
      flexDirection={"column"}
    >
      <HeaderWrapper>
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
        <Flex alignItems={"center"}>
          <PostButton />
          <AuthButton />
        </Flex>
      </HeaderWrapper>
      <MainWrapper>
        {children}
      </MainWrapper>
    </Box>
  );
}
