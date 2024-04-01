'use client'
import { useState, useEffect } from "react";
import { Heading, Box, Grid, GridItem, Image, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, ModalHeader, ModalCloseButton } from "@chakra-ui/react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { createClient } from "@/utils/supabase/client";

export const BeforeAfterImages = ({ job }) => {
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchImages = async () => {
      const supabase = createClient();

      const beforeImagesData = await Promise.allSettled(
        job.job_files
          .filter((file) => file.file_type === "before")
          .map(async (file) => {
            const { data: originalData, error: originalError } = await supabase.storage
              .from("job_files")
              .getPublicUrl(file.file_path, {
                transform: { width: 1000, height: 1000 },
              });

            const { data: thumbnailData, error: thumbnailError } = await supabase.storage
              .from("job_files")
              .getPublicUrl(file.file_path, {
                transform: { width: 200, height: 200 },
              });

            if (originalError || thumbnailError) {
              console.error("Error fetching file URLs", originalError, thumbnailError);
              return null;
            }

            return {
              original: originalData.publicUrl,
              thumbnail: thumbnailData.publicUrl,
            };
          })
      );

      const afterImagesData = await Promise.allSettled(
        job.job_files
          .filter((file) => file.file_type === "after")
          .map(async (file) => {
            const { data: originalData, error: originalError } = await supabase.storage
              .from("job_files")
              .getPublicUrl(file.file_path, {
                transform: { width: 1000, height: 1000 },
              });

            const { data: thumbnailData, error: thumbnailError } = await supabase.storage
              .from("job_files")
              .getPublicUrl(file.file_path, {
                transform: { width: 200, height: 200 },
              });

            if (originalError || thumbnailError) {
              console.error("Error fetching file URLs", originalError, thumbnailError);
              return null;
            }

            return {
              original: originalData.publicUrl,
              thumbnail: thumbnailData.publicUrl,
            };
          })
      );

      setBeforeImages(beforeImagesData.map((result) => result.value).filter(Boolean));
      setAfterImages(afterImagesData.map((result) => result.value).filter(Boolean));
    };

    fetchImages();
  }, [job.job_files]);

  const openModal = (images) => {
    setSelectedImages(images);
    onOpen();
  };

  return (
    <Box>
    <Heading size="md" mb="4">
      Before Pictures
    </Heading>
    <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
      {beforeImages.map((image, index) => (
        <GridItem key={index} onClick={() => openModal(beforeImages)}>
          <Box cursor="pointer">
            <Image src={image.thumbnail} alt={`Before ${index + 1}`} />
          </Box>
        </GridItem>
      ))}
    </Grid>

    <Heading size="md" mb="4" mt="8">
      After Pictures
    </Heading>
    <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
      {afterImages.map((image, index) => (
        <GridItem key={index} onClick={() => openModal(afterImages)}>
          <Box cursor="pointer">
            <Image src={image.thumbnail} alt={`After ${index + 1}`} />
          </Box>
        </GridItem>
      ))}
    </Grid>
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
  <ModalOverlay />
  <ModalContent maxHeight="90vh" maxWidth="90vw" display="flex" flexDirection="column">
    <ModalHeader>
      <ModalCloseButton />
    </ModalHeader>
    <ModalBody flex="1" overflowY="auto" p="4">
      <ImageGallery items={selectedImages} />
    </ModalBody>
  </ModalContent>
</Modal>
    </Box>
  );
};