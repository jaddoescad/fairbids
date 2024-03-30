"use client";

import React, { useState, useEffect } from "react";
import { Input, Box } from "@chakra-ui/react";
import { updateJobTitle } from "../../services/updateTitle";
import { useRouter } from 'next/navigation';
import { TopTitle } from "./FormReusable/TopTitle";

export function TitleInput({ initialTitle, setTitle }) {
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
    </Box>
  );
}