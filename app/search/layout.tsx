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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box w={"full"} h={"full"} display={"flex"} flexDirection={"column"}>
      <NavBar />
      <MainWrapper>{children}</MainWrapper>
    </Box>
  );
}
