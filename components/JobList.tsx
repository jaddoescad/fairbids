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
} from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

export default function JobList({ jobs }) {
  return (
    <Box w="100%">
      <Heading as="h2" size="xl" mb={8}>
        Nearest Jobs
      </Heading>
      <VStack spacing={6} align="stretch">
        {jobs.map((job) => (
          <JobItem key={job.id} job={job} />
        ))}
      </VStack>
    </Box>
  );
}

function JobItem({ job }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handlePrevImage = (e) => {
    e.preventDefault();
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? job.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === job.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Link href={`/job/${job.id}`}>
      <Flex
        borderWidth={1}
        borderRadius="lg"
        p={6}
        boxShadow="md"
        bg="white"
        w="100%"
      >
        {job.imageUrls && job.imageUrls.length > 0 && (
          <Flex mb={4} align="center">
            <Button
              onClick={(e) => handlePrevImage(e)}
              mr={2}
              size="sm"
              variant="ghost"
            >
              <ArrowLeftIcon />
            </Button>
            <Box position="relative" width={350} height={350}>
              {isImageLoading ? (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* Render your loader component here */}
                  <Spinner size="xl" />
                </Box>
              ) : null}
              <Image
                src={job.imageUrls[currentImageIndex]}
                alt={`Job Image ${currentImageIndex + 1}`}
                width={350}
                height={350}
                objectFit="cover"
                onLoad={() => setIsImageLoading(false)}
                opacity={isImageLoading ? 0 : 1}
                transition="opacity 0.3s"
              />
            </Box>
            <Button
              onClick={(e) => handleNextImage(e)}
              ml={2}
              size="sm"
              variant="ghost"
            >
              <ArrowRightIcon />
            </Button>
          </Flex>
        )}
        <Box>
          <Heading as="h3" size="lg" mb={2}>
            <Link href={`/job/${job.id}`}>{job.title}</Link>
          </Heading>
          <Text fontSize="lg" mb={2}>
            {job.company}
          </Text>
          <Text mb={4} fontSize="lg" color="gray.600">
            {job.location}
          </Text>
          <Box display="inline-block">
            <Text
              fontSize="lg"
              mb={2}
              backgroundColor="green"
              color="white"
              fontWeight="bold"
              borderRadius="lg"
              px={2}
              py={1}
            >
              {job.quote_count === 1
                ? `1 Quote | Avg. $${job.average_quote_value || "N/A"}`
                : `${job.quote_count} Quotes | Avg. $${
                    job.average_quote_value || "N/A"
                  }`}
            </Text>
          </Box>
          <Text>
            {job?.description && (
              <>
                <Text
                  fontSize="x-large"
                  whiteSpace="pre-wrap"
                  color="gray.600"
                  mb={4}
                  wordBreak="break-word"
                  width={"100%"}
                  maxW={"1000px"}
                >
                  {job.description.slice(0, 300)}...
                </Text>
              </>
            )}
          </Text>
          {/* Display quote information */}
        </Box>
      </Flex>
    </Link>
  );
}
