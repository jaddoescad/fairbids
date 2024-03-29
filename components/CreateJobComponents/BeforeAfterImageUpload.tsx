"use client";

import { TopTitle } from "./FormReusable/TopTitle";
import { ImageUpload } from "./ImageUpload";
import { Text, Box } from "@chakra-ui/react";

export const BeforeImages = ({ job }) => {
  const beforeImages = job.job_files
    .filter((file) => file.file_type === "before")
    .map((file) => file.file_url);

  return (
    <Box>
      <TopTitle>Before Pictures</TopTitle>
      <ImageUpload
        jobId={job.id}
        imageType="before"
        initialImages={beforeImages}
      />
    </Box>
  );
};

export const AfterImages = ({ job }) => {
  const afterImages = job.job_files
    .filter((file) => file.file_type === "after")
    .map((file) => file.file_url);
  return (
    <Box>
      <TopTitle>After Pictures</TopTitle>
      <ImageUpload
        jobId={job.id}
        imageType="after"
        initialImages={afterImages}
      />
    </Box>
  );
};