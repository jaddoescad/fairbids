"use client";
import { useRouter } from "next/navigation";
import { Box, Textarea, Text } from "@chakra-ui/react";
import { TopTitle } from "./FormReusable/TopTitle";

interface DescriptionInputProps {
  initialDescription: string;
  setDescription: (value: string) => void;
  errorMessage: string | undefined;
}

export function DescriptionInput({
  initialDescription,
  setDescription,
  errorMessage,
}: DescriptionInputProps) {
  const router = useRouter();

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return (
    <Box py={4}>
      <TopTitle>Description</TopTitle>
      <Textarea
        value={initialDescription}
        onChange={handleDescriptionChange}
        placeholder="Enter job description"
        size="lg"
        h={"200px"}
        resize={"none"}
        p={5}
      />
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
    </Box>
  );
}