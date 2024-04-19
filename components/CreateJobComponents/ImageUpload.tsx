import { useEffect, useState } from "react";
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
import { DeleteIcon } from "@chakra-ui/icons";
import { ImageUploadProps, ImageType } from "@/types/types";

export const ImageUpload = ({
  imageType,
  initialImages,
  onImagesChange,
  setImagesToDelete,
}: ImageUploadProps) => {
  const [images, setImages] = useState<ImageType[]>(initialImages || []);
  const [markedForDelete, setMarkedForDelete] = useState<ImageType[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files as FileList);
    const newImages = files.map((file) => ({
      filePath: file.name,
      preview: URL.createObjectURL(file),
      file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
    onImagesChange([...images, ...newImages]);
  };

  const handleDelete = (index: number) => {
    const image = images[index];

    if (image.preview) {
      // If the image has a preview property, it means it's a local image
      setImages((prevImages) => prevImages.filter((img) => img !== image));
      onImagesChange(images.filter((img) => img !== image));
    } else {
      // If the image doesn't have a preview property, it means it's an uploaded image
      const isMarked = markedForDelete.includes(image);
      if (isMarked) {
        setMarkedForDelete((prevMarked) =>
          prevMarked.filter((img) => img !== image)
        );
        setImagesToDelete(
          markedForDelete
            .filter((img) => img !== image)
            .map((img) => img.filePath)
        );
      } else {
        setMarkedForDelete((prevMarked) => [...prevMarked, image]);
        setImagesToDelete([
          ...markedForDelete.map((img) => img.filePath),
          image.filePath,
        ]);
      }
    }
  };

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);
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
                  <Heading fontSize="md" color="gray.700" fontWeight="bold">
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
                onChange={handleImageChange}
                _disabled={{
                  cursor: "not-allowed",
                }}
              />
            </Box>
          </Box>
        </AspectRatio>
        {images.map((image, index) => (
          <Box key={image.filePath || image.preview} position="relative">
            <AspectRatio width="64" ratio={1} m="2">
              <Image
                src={image.publicUrl || image.preview}
                alt={`${imageType} picture`}
                objectFit="cover"
                opacity={markedForDelete.includes(image) ? 0.5 : 1}
              />
            </AspectRatio>
            <IconButton
              icon={<DeleteIcon />}
              colorScheme={markedForDelete.includes(image) ? "gray" : "red"}
              aria-label="Delete image"
              size="sm"
              position="absolute"
              top="4"
              right="4"
              onClick={() => handleDelete(index)}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
