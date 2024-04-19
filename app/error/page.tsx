'use client'; // Error components must be Client Components

import { Center } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Center>
      <h1>Something wrong! Please try again...</h1>
    </Center>
  );
}