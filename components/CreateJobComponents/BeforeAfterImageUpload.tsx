"use client";
import { AfterImagesProps, BeforeImagesProps, ImageType } from "@/types/types";
import { TopTitle } from "./FormReusable/TopTitle";
import { ImageUpload } from "./ImageUpload";
import { Text, Box } from "@chakra-ui/react";

interface JobFile {
  file_url: string;
  file_path: string;
  file_type: string;
}

interface Job {
  job_files: JobFile[];
}



export const BeforeImages = ({ job, onBeforeImagesChange, setImagesToDelete }: BeforeImagesProps) => {
  const beforeImages = job.job_files
    .filter((file: JobFile) => file.file_type === "before")
    .map((file: JobFile) => ({
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


export const AfterImages = ({ job, onAfterImagesChange, setImagesToDelete, errorMessage }: AfterImagesProps) => {
  const afterImages = job.job_files
    .filter((file: JobFile) => file.file_type === "after")
    .map((file: JobFile) => ({
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
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
    </Box>
  );
};