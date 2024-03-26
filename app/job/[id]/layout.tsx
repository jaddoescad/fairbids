import * as React from "react";
import { Box, Flex, Spacer, Button } from "@chakra-ui/react";
import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full">
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg="white"
        borderBottom="1px solid black"
      >
        <Flex align="center" mr={5}>
          <Image src={"/logo.png"} alt="Logo" width={125} height={125} priority={true}/>
        </Flex>
        <Spacer />
      </Flex>
      <div className="flex-grow flex flex-col items-center">{children}</div>
    </div>
  );
}
