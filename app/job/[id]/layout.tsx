import * as React from "react";
import { Flex } from "@chakra-ui/react";
import AuthButton from "@/components/AuthButton";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import Logo from "@/components/Logo";
import PostButton from "@/components/PostQuoteButton";
import { LocationBar, SearchBar } from "@/components/LocationBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <AuthButton />
        </Flex>
      </HeaderWrapper>
      <div style={{ maxWidth: "2050px", width: "100%" }}>{children}</div>
    </div>
  );
}