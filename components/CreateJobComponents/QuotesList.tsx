// QuotesList.js
import { useEffect, useState } from "react";
import { Box, VStack, HStack, Text, Image, Button } from "@chakra-ui/react";
import Link from 'next/navigation'

export function QuotesList({ quotes, setQuotes, setQuotesToDelete }) {
  useEffect(() => {
    console.log("QuotesList quotes", quotes);
  }, [quotes]);

  const handleToggleDelete = (quoteId, index) => {
    if (quoteId) {
      // For existing quotes with an ID
      setQuotes((prevQuotes) =>
        prevQuotes.map((quote) =>
          quote.id === quoteId
            ? { ...quote, markedForDelete: !quote.markedForDelete }
            : quote
        )
      );

      setQuotesToDelete((prevQuotesToDelete) => {
        if (prevQuotesToDelete.includes(quoteId)) {
          return prevQuotesToDelete.filter((id) => id !== quoteId);
        } else {
          return [...prevQuotesToDelete, quoteId];
        }
      });
    } else {
      // For local quotes without an ID
      setQuotes((prevQuotes) =>
        prevQuotes.filter((_, i) => i !== index)
      );
    }
  };

  const isLocalFile = (file) => file instanceof File;

  const getFileName = (filePath) => {
    return filePath.split("/").pop();
  };

  return (
    <Box py={4}>
      <VStack spacing={4} align="stretch">
        {quotes.map((quote, index) => (
          <Box
            key={quote.id}
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
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    mb={2}
                    opacity={quote.markedForDelete ? 0.5 : 1}
                  >
                    <Box width="100px" height="100px" mr={4}>
                      {isLocalFile(file) ? (
                        file.type && file.type.startsWith("image/") ? (
                          <a href={URL.createObjectURL(file)} target="_blank">

                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                          />
                          </a>
                        ) : (
                          <a href={URL.createObjectURL(file)} target="_blank">

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
                        )
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
                    <a
                      href={isLocalFile(file) ? URL.createObjectURL(file) : file.file_url}
                      target="_blank"
                    >
                    <Text color="blue.500" fontWeight="bold" cursor="pointer">
                      {isLocalFile(file) ? file.name : getFileName(file.file_path)}
                    </Text>
                    </a>
                  </Box>
                ))}
            </VStack>
            {quote.id ? (
              <Button
                colorScheme={quote.markedForDelete ? "green" : "red"}
                size="sm"
                onClick={() => handleToggleDelete(quote.id)}
              >
                {quote.markedForDelete ? "Unmark for Delete" : "Mark for Delete"}
              </Button>
            ) : (
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => handleToggleDelete(null, index)}
              >
                Remove
              </Button>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}