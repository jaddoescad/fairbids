import * as React from "react";
import { Box } from "@chakra-ui/react";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box w="100%" flex="1" padding={5} style={{ background: "#f2f2f2" }}>
      {children}
    </Box>
  );
}
