import { useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  Image,
  Flex,
} from "@chakra-ui/react";
import { uploadImage } from "../../services/uploadImage";
import { createClient } from "@/utils/supabase/client";

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
    const uploadPromises = files.map(async (file) => {
      const publicUrl = await uploadImage(
        supabase,
        file,
        userId,
        jobId,
        imageType
      );
      return publicUrl;
    });

    const uploadedImages = await Promise.all(uploadPromises);
    setImages((prevImages) => [...prevImages, ...uploadedImages]);

    setUploading(false);
  };

  return (
    <Box my="4">
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
                aria-hidden="true"
                onChange={handleUpload}
                disabled={uploading}
              />
            </Box>
          </Box>
        </AspectRatio>
        {images.map((imageUrl) => (
          <AspectRatio key={imageUrl} width="64" ratio={1} m="2">
            <Image src={imageUrl} alt={`${imageType} picture`} objectFit="cover" />
          </AspectRatio>
        ))}
      </Flex>
      {uploading && <Text>Uploading...</Text>}
    </Box>
  );
};