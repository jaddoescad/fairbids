'use client'

import { useState, useEffect } from "react";
import { Heading, Box, Grid, GridItem, Image, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, ModalHeader, ModalCloseButton } from "@chakra-ui/react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Job } from "@/types/types";
import { fetchJobImages } from "@/services/fetchJobData";

export const BeforeAfterImages = ({ job }: { job: Job }) => {
  const [beforeImages, setBeforeImages] = useState<{ original: string; thumbnail: string }[]>([]);
  const [afterImages, setAfterImages] = useState<{ original: string; thumbnail: string }[]>([]);
  const [selectedImages, setSelectedImages] = useState<{ original: string; thumbnail: string }[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchImages = async () => {
      const beforeImagesData = await fetchJobImages(job.job_files, "before");
      const afterImagesData = await fetchJobImages(job.job_files, "after");

      setBeforeImages(beforeImagesData);
      setAfterImages(afterImagesData);
    };

    fetchImages();
  }, [job.job_files]);

  const openModal = (images: { original: string; thumbnail: string }[]) => {
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
            <Image src={image?.thumbnail} alt={`After ${index + 1}`} />
          </Box>
        </GridItem>
      ))}
    </Grid>
    <Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent maxHeight="90vh" maxWidth="90vw">
    <ModalHeader>
      <ModalCloseButton />
    </ModalHeader>
    <ModalBody p="0">
      <ImageGallery
        items={selectedImages}
        thumbnailPosition="bottom"
        showPlayButton={false}
        showFullscreenButton={false}
        renderItem={({ original }) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <img src={original} alt="Gallery Image" style={{ height:"100%" ,width: '100%', objectFit: 'contain' }} />
          </div>
        )}
      />
    </ModalBody>
  </ModalContent>
</Modal>
    </Box>
  );
};