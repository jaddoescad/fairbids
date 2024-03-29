import { useState } from "react";
import {
  AspectRatio,
  Box,
  Heading,
  Input,
  Stack,
  Text,
  Image,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { deleteImage, uploadImages } from "../../services/uploadImage";
import { createClient } from "@/utils/supabase/client";
import { DeleteIcon } from "@chakra-ui/icons";

export const ImageUpload = ({ jobId, imageType, initialImages }) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(initialImages || []);

  const handleUpload = async (event) => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user.id;
    setUploading(true);
    const files = Array.from(event.target.files);
    const uploadedImages = await uploadImages(files, userId, jobId, imageType);
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
    setUploading(false);
  };

  return (
    <Box>
      <Flex flexWrap="wrap">
        <AspectRatio width="64" ratio={1} m="2">
          <Box
            borderColor="gray.300"
            borderStyle="dashed"
            borderWidth="2px"
            rounded="md"
            shadow="sm"
            transition="all 150ms ease-in-out"
            _hover={{
              shadow: "md",
            }}
          >
            <Box position="relative" height="100%" width="100%">
              <Stack
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justify="center"
                spacing="4"
              >
                <Stack p="8" textAlign="center" spacing="1">
                  <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                    Drop images here
                  </Heading>
                  <Text fontWeight="light">or click to upload</Text>
                </Stack>
              </Stack>
              <Input
                type="file"
                multiple
                accept="image/*"
                height="100%"
                width="100%"
                position="absolute"
                top="0"
                left="0"
                opacity="0"
                cursor={"pointer"}
                aria-hidden="true"
                onChange={handleUpload}
                disabled={uploading}
                _disabled={{
                  cursor: "not-allowed",
                }}  
              />
            </Box>
          </Box>
        </AspectRatio>
        {images.map((filePath) => (
          <AspectRatio key={filePath} width="64" ratio={1} m="2">
          <Image
            src={filePath}
            alt={`${imageType} picture`}
            objectFit="cover"
          />
        </AspectRatio>
        ))}
      </Flex>
      {uploading && <Text>Uploading...</Text>}
    </Box>
  );
};