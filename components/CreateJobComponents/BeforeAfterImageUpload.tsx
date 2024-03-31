"use client";
import { TopTitle } from "./FormReusable/TopTitle";
import { ImageUpload } from "./ImageUpload";
import { Text, Box } from "@chakra-ui/react";

export const BeforeImages = ({ job, onBeforeImagesChange, setImagesToDelete }) => {
  const beforeImages = job.job_files
    .filter((file) => file.file_type === "before")
    .map((file) => ({
      publicUrl: file.file_url,
      filePath: file.file_path,
    }));

  return (
    <Box>
      <TopTitle>Before Pictures</TopTitle>
      <ImageUpload
        imageType="before"
        initialImages={beforeImages}
        onImagesChange={onBeforeImagesChange}
        setImagesToDelete={setImagesToDelete}
      />
    </Box>
  );
};

export const AfterImages = ({ job, onAfterImagesChange, setImagesToDelete }) => {
  const afterImages = job.job_files
    .filter((file) => file.file_type === "after")
    .map((file) => ({
      publicUrl: file.file_url,
      filePath: file.file_path,
    }));

  return (
    <Box>
      <TopTitle>After Pictures</TopTitle>
      <ImageUpload
        imageType="after"
        initialImages={afterImages}
        onImagesChange={onAfterImagesChange}
        setImagesToDelete={setImagesToDelete}
      />
    </Box>
  );
};