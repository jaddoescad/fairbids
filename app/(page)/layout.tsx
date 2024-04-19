import * as React from "react";
import { Box } from "@chakra-ui/react";
import MainWrapper from "@/components/wrappers/MainWrapper";
import NavBar from "@/components/NavBar";
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box w={"full"} h={"full"} display={"flex"} flexDirection={"column"}>
      <NavBar />
      <MainWrapper>{children}</MainWrapper>
      <Footer />
    </Box>
  );
}