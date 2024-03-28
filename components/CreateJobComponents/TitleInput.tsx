"use client";
import React, { useState, useEffect } from "react";
import { Input, Box, Text } from "@chakra-ui/react";
import { updateJobTitle } from "../../services/updateTitle";
import { useRouter } from 'next/navigation';
import { Textarea } from '@chakra-ui/react'
import { TopTitle } from "./FormReusable/TopTitle";

export function TitleInput({ initialTitle, jobId }) {
  const [title, setTitle] = useState(initialTitle);
  const router = useRouter();

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      try {
        await updateJobTitle(jobId, title);
        router.refresh();
      } catch (error) {
        console.error("Error updating job title", error);
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [title, jobId, router]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  return (
    <Box py={4}>
      <TopTitle>Title</TopTitle>
      <Input
        value={title}
        onChange={handleTitleChange}
        placeholder="Kitchen remodel: Electrical, plumbing, and drywall"
        size="lg"
        maxW={"500px"}
        p={5}
      />
    </Box>
  );
}