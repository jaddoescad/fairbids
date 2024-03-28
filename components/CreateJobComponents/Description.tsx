"use client";
import { useState, useEffect } from "react";
import { updateJobDescription } from "../../services/updateDescription";
import { useRouter } from "next/navigation";
import { Box, Textarea, Text } from "@chakra-ui/react";
import { TopTitle } from "./FormReusable/TopTitle";

export function DescriptionInput({ initialDescription, jobId }) {
  const [description, setDescription] = useState(initialDescription || "");
  const router = useRouter();

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      try {
        await updateJobDescription(jobId, description);
        router.refresh();
      } catch (error) {
        console.error("Error updating job description", error);
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [description, jobId, router]);

  return (
    <Box py={4}>
      <TopTitle>
        Description
      </TopTitle>
      <Textarea
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Enter job description"
        size="lg"
        h={"200px"}
        resize={"none"}
        p={5}
      />
    </Box>
  );
}
