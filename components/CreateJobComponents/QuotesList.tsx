// QuotesList.js
import { useEffect, useState } from "react";
import { Box, VStack, HStack, Text, Image, Button } from "@chakra-ui/react";

export function QuotesList({ quotes, setQuotes, setQuotesToDelete }) {
  useEffect(() => {
    console.log("QuotesList quotes", quotes);
  }, [quotes]);

  const handleToggleDelete = (quoteId) => {
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
  };

  const isLocalFile = (file) => file instanceof File;

  return (
    <Box py={4}>
      <VStack spacing={4} align="stretch">
        {quotes.map((quote) => (
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
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                          />
                        ) : (
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
                        )
                      ) : (
                        <Image
                          src={file.file_url}
                          alt={file.file_path}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                        />
                      )}
                    </Box>
                    <Text color="blue.500" fontWeight="bold" cursor="pointer">
                      {isLocalFile(file) ? file.name : file.file_path}
                    </Text>
                  </Box>
                ))}
            </VStack>
            {quote.id && (
              <Button
                colorScheme={quote.markedForDelete ? "green" : "red"}
                size="sm"
                onClick={() => handleToggleDelete(quote.id)}
              >
                {quote.markedForDelete ? "Unmark for Delete" : "Mark for Delete"}
              </Button>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}