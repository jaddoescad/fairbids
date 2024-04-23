"use client";
// components/JobList.js
import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Flex,
  Image,
  Spinner,
  Center,
  Stack,
} from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { Job, JobItemProps, JobListProps } from "@/types/types";
import { IconButton } from "@chakra-ui/react";

export default function JobList({ jobs }: JobListProps) {
  return (
    <VStack spacing={6} align="stretch">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </VStack>
  );
}



function JobItem({ job }: JobItemProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handlePrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? job.image_urls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === job.image_urls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
<Link href={`/job/${job.id}`}>
  <Flex borderWidth={1} borderRadius="md" p={6} boxShadow="md" bg="white" h="250px">
    {job.image_urls && job.image_urls.length > 0 && (
      <Box position="relative" height={"100%"} w={"200px"} mr={4} bg="red" flexShrink={0}>
        <Stack position="relative" width="100%" height="100%">
          <Box position="absolute" width="100%" height="100%">
            <Image
              src={job.image_urls[currentImageIndex]}
              alt={`Job Image ${currentImageIndex + 1}`}
              width={"100%"}
              height={"100%"}
              objectFit="cover"
              onLoad={() => setIsImageLoading(false)}
              opacity={isImageLoading ? 0 : 1}
              transition="opacity 0.3s"
            />
            {isImageLoading && (
              <Center position="absolute" top={0} left={0} width="100%" height="100%">
                <Spinner size="xl" />
              </Center>
            )}
          </Box>
          <Stack position="absolute" top="50%" transform="translateY(-50%)" direction="row" justify="space-between" width="100%" px={2}>
            <IconButton
              onClick={handlePrevImage}
              size="sm"
              aria-label="Previous Image"
              borderRadius="full"
              variant="solid"
              bgColor="black"
              color="white"
              _hover={{ bgColor: "gray.800" }}
              icon={<ChevronLeftIcon boxSize={8} />}
            />
            <IconButton
              onClick={handleNextImage}
              aria-label="Next Image"
              size="sm"
              borderRadius="full"
              variant="solid"
              bgColor="black"
              color="white"
              _hover={{ bgColor: "gray.800" }}
              icon={<ChevronRightIcon boxSize={8} />}
            />
          </Stack>
        </Stack>
      </Box>
    )}
    <Box>
      <Heading as="h3" size="md" mb={2}>
        {job.title}
      </Heading>
      <Text fontSize="md" color="gray.600">
        {job.address}
      </Text>
      {job?.description && (
        <Text fontSize="md" color="gray.600" mb={4} mt={2} wordBreak="break-word" width={"100%"} maxW={"1000px"} noOfLines={3}>
          {job.description.replace(/\\n/g, " ")}
        </Text>
      )}
      <Box display="inline-block">
        <Text fontSize="sm" mb={2} backgroundColor="green" color="white" fontWeight="bold" borderRadius="sm" px={2} py={1}>
          {job.quote_count === 1 ? `1 Quote | Avg. $${job.average_quote_value || "N/A"}` : `${job.quote_count} Quotes | Avg. $${job.average_quote_value || "N/A"}`}
        </Text>
      </Box>
    </Box>
  </Flex>
</Link>
  );
}