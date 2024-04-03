"use client";

import React from "react";
import { Input, Box, Text } from "@chakra-ui/react";
import { TopTitle } from "./FormReusable/TopTitle";

export function TitleInput({ initialTitle, setTitle, errorMessage }) {
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  return (
    <Box py={4}>
      <TopTitle>Title</TopTitle>
      <Input
        value={initialTitle}
        onChange={handleTitleChange}
        placeholder="Kitchen remodel: Electrical, plumbing, and drywall"
        size="lg"
        maxW={"500px"}
        p={5}
      />
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}{" "}
      {/* Display error message */}
    </Box>
  );
}