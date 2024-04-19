import { Center, Text } from "@chakra-ui/react";
import { useEffect } from "react";

export default function ErrorComponent({
    error,
    reset,
  }: {
    error: Error;
    reset: () => void;
  }) {
    useEffect(() => {
      console.error(error);
    }, [error]);
    return (
      <Center mt={10}>
        <Text>Something went wrong! Please try again...</Text>
      </Center>
    );
  }
  