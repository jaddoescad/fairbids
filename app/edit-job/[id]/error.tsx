"use client";

import ErrorComponent from "@/components/ErrorComponent";
import { Center, Text } from "@chakra-ui/react";
import { use, useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {

  return (
    <ErrorComponent error={error} reset={reset}/>
  );
}
