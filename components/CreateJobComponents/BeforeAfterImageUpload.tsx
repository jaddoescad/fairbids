"use client";

import { ImageUpload } from "./ImageUpload";
import { Text, Box } from "@chakra-ui/react";

export const BeforeImages = ({ jobId, initialImages }) => {


    return (
      <Box>
        <Text fontSize={"lg"} fontWeight="bold">
          Before Pictures
        </Text>
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
        <Text fontSize={"lg"} fontWeight="bold">
          After Pictures
        </Text>
        <ImageUpload
          jobId={jobId}
          imageType="after"
          initialImages={initialImages}
        />
      </Box>
    );
  };