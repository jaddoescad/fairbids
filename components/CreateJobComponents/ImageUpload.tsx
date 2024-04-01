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

export const ImageUpload = ({
  imageType,
  initialImages,
  onImagesChange,
  setImagesToDelete,
}) => {
  const [images, setImages] = useState(initialImages || []);
  const [markedForDelete, setMarkedForDelete] = useState([]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
    onImagesChange((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDelete = (index) => {
    const image = images[index];
  
    if (image.preview) {
      // If the image has a preview URL, it means it's a local image
      setImages((prevImages) => prevImages.filter((img) => img !== image));
      onImagesChange((prevImages) => prevImages.filter((img) => img !== image));
    } else {
      // If the image doesn't have a preview URL, it means it's an uploaded image
      const isMarked = markedForDelete.includes(image);
      if (isMarked) {
        setMarkedForDelete((prevMarked) => prevMarked.filter((img) => img !== image));
        setImagesToDelete((prevImagesToDelete) =>
          prevImagesToDelete.filter((img) => img !== image)
        );
      } else {
        setMarkedForDelete((prevMarked) => [...prevMarked, image]);
        setImagesToDelete((prevImagesToDelete) => [...prevImagesToDelete, image]);
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
