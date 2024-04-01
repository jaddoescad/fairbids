"use server";

import { Box, Text, Center, Button } from "@chakra-ui/react";
import { fetchJobData } from "@/services/fetchJobData";

export default async function JobDetailsContent({ jobId }) {
  const job = await fetchJobData(jobId);

  return (
    <Box marginTop={10} paddingBottom={"200px"}>
      <Box background={"white"} padding={10}>
        <Text as="h1" fontSize="3xl" fontWeight="bold">
          {job.title}
        </Text>

        <Text as="h2" fontSize="xl" fontWeight="bold" mt={4}>
          Category: {job.category}
        </Text>

        <Text as="h2" fontSize="xl" fontWeight="bold" mt={4}>
          Location: {job.location}
        </Text>

        <Text as="p" mt={4}>
          {job.description}
        </Text>

        <BeforeAfterImages job={job} />

        <QuotesList quotes={job.quotes || []} />
      </Box>
    </Box>
  );
}

import { Heading, Image, Flex } from "@chakra-ui/react";

export const BeforeAfterImages = ({ job }) => {
  const beforeImages = job.job_files
    .filter((file) => file.file_type === "before")
    .map((file) => ({ publicUrl: file.file_url }));

  const afterImages = job.job_files
    .filter((file) => file.file_type === "after")
    .map((file) => ({ publicUrl: file.file_url }));

  return (
    <Box>
      <Heading size="md" mb="4">
        Before Pictures
      </Heading>
      <Flex flexWrap="wrap">
        {beforeImages.map((image, index) => (
          <Box key={index} width="64" m="2">
            <Image
              src={image.publicUrl}
              alt={`Before picture ${index + 1}`}
              objectFit="cover"
            />
          </Box>
        ))}
      </Flex>

      <Heading size="md" mb="4" mt="8">
        After Pictures
      </Heading>
      <Flex flexWrap="wrap">
        {afterImages.map((image, index) => (
          <Box key={index} width="64" m="2">
            <Image
              src={image.publicUrl}
              alt={`After picture ${index + 1}`}
              objectFit="cover"
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

// QuotesList.js
import { VStack, HStack } from "@chakra-ui/react";

export const QuotesList = ({ quotes }) => {
  const getFileName = (filePath) => {
    return filePath.split("/").pop();
  };

  const isPdfFile = (file) => {
    const fileName = getFileName(file.file_path);
    return fileName.toLowerCase().endsWith(".pdf");
  };

  return (
    <Box py={4}>
      <VStack spacing={4} align="stretch">
        {quotes.map((quote, index) => (
          <Box
            key={index}
            borderWidth={1}
            borderRadius="lg"
            p={4}
            boxShadow="md"
            bg="white"
          >
            <VStack align="stretch" spacing={2}>
              <Text fontSize="xl" fontWeight="bold">
                {quote.title}
              </Text>
              <HStack>
                <Text fontWeight="medium">Value:</Text>
                <Text>${quote.value}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="medium">Attachments:</Text>
              </HStack>
              {quote.quote_files &&
                quote.quote_files.map((file, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Box width="100px" height="100px" mr={4}>
                      {isPdfFile(file) ? (
                        <a href={file.file_url} target="_blank">
                          <Box
                            bg="gray.100"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            width="100%"
                            height="100%"
                          >
                            <Text>PDF</Text>
                          </Box>
                        </a>
                      ) : (
                        <a href={file.file_url} target="_blank">
                          <Image
                            src={file.file_url}
                            alt={file.file_path}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                          />
                        </a>
                      )}
                    </Box>
                    <a href={file.file_url} target="_blank">
                      <Text color="blue.500" fontWeight="bold" cursor="pointer">
                        {getFileName(file.file_path)}
                      </Text>
                    </a>
                  </Box>
                ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};
