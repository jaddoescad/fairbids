"use client";

import { TopTitle } from "./FormReusable/TopTitle";
import { ImageUpload } from "./ImageUpload";
import { Text, Box } from "@chakra-ui/react";

export const BeforeImages = ({ jobId, initialImages }) => {


    return (
      <Box>
        <TopTitle>Before Pictures</TopTitle>
        <ImageUpload
          jobId={jobId}
          imageType="before"
          initialImages={initialImages}
        />
      </Box>
    );
  };
  
  export const AfterImages = ({ jobId, initialImages }) => {
    return (
      <Box>
        <TopTitle>After Pictures</TopTitle>
        <ImageUpload
          jobId={jobId}
          imageType="after"
          initialImages={initialImages}
        />
      </Box>
    );
  };