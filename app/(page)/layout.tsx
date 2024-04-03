import * as React from "react";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#f2f2f2" }} className="w-full flex flex-col items-center">
      <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="white" w={"100%"} borderBottom="1px solid black">
        <Flex w="100%" maxW={"2050px"} mx="auto">
          <Flex w="100%" mr={5}>
            <Link href="/">
              <Image src={"/logo.png"} alt="Logo" width={125} height={125} priority={true} />
            </Link>
          </Flex>
          <Flex>
            <AuthButton />
          </Flex>
        </Flex>
      </Flex>
      <div style={{ maxWidth: "2050px", width: "100%" }}>{children}</div>
    </div>
  );
}