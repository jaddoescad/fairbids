// QuotesList.js
import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Image,
  Button,
} from "@chakra-ui/react";
import { deleteQuote } from "@/services/uploadQuoteFile";
import { createClient } from "@/utils/supabase/client";

export function QuotesList({ quotes, setQuotes }) {
  const supabase = createClient();
  const [deletingQuoteId, setDeletingQuoteId] = useState(null);

  useEffect(() => {
    console.log("QuotesList quotes", quotes);
  }, [quotes]);

  const handleDeleteQuote = async (quoteId) => {
    try {
      setDeletingQuoteId(quoteId);
      await deleteQuote(supabase, quoteId);
      setQuotes((prevQuotes) =>
        prevQuotes.filter((quote) => quote.id !== quoteId)
      );
    } catch (error) {
      console.error("Error deleting quote:", error);
      alert("An error occurred while deleting the quote. Please try again.");
    } finally {
      setDeletingQuoteId(null);
    }
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
                  <Box key={index} display="flex" alignItems="center" mb={2}>
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
                colorScheme="red"
                size="sm"
                onClick={() => handleDeleteQuote(quote.id)}
                isLoading={deletingQuoteId === quote.id}
              >
                Delete
              </Button>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
