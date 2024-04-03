"use server";

import { Box, Text, Center, Button, Heading, Image, Flex } from "@chakra-ui/react";
import { fetchJobData } from "@/services/fetchJobData";
import { FaMapMarkerAlt } from "react-icons/fa";

export default async function JobDetailsContent({ jobId }) {
  const job = await fetchJobData(jobId);

  return (
    <Box marginTop={10} paddingBottom={"200px"}>
      <Box background={"white"} padding={10}>
        <Text as="h1" fontSize="3xl" fontWeight="bold">
          {job.title}
        </Text>

        <Flex>
          <Box
            as="span"
            display="flex"
            alignItems="center"
            color="gray.500"
            mr={2}
            fontSize={"larger"}
          >
          <FaMapMarkerAlt />
          </Box>
          <Flex
            direction={"row"}
            gap={2}
          >
            
          <Text as="h2" fontSize="large" fontWeight="medium">
            {job.location}
          </Text>

          -

          {job.display_name && (
            <Text as="span" fontSize="large" fontWeight="medium" color="gray.500">
              Posted by: {job.display_name}
            </Text>
          )}
          </Flex>
        </Flex>
        <Text
          fontSize="large"
          fontWeight="medium"
          color="gray.500"
          mt={5}
          mb={10}
          maxWidth="1000px"
        >
          {job.description}
        </Text>

        <BeforeAfterImages job={job} />

        <QuotesList quotes={job.quotes || []} />
      </Box>
    </Box>
  );
}



// QuotesList.js
import { VStack, HStack } from "@chakra-ui/react";
import { BeforeAfterImages } from "./BeforeAfterImages";

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
            <Heading size="md" mb="4">
       Quotes
      </Heading>
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
