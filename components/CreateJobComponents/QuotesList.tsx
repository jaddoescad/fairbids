// QuotesList.js
"use client";
import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Link,
  Image,
  Button,
} from "@chakra-ui/react";
import { deleteQuote } from "@/services/uploadQuoteFile";
import { createClient } from "@/utils/supabase/client";

export function QuotesList({ initialQuotes, onAdd }) {
  const [quotes, setQuotes] = useState(initialQuotes || []);
  const supabase = createClient();
  const [deletingQuoteId, setDeletingQuoteId] = useState(null);

  useEffect(() => {
    if (onAdd) {
      setQuotes((prevQuotes) => [...prevQuotes, onAdd]);
    }
  }, [onAdd]);

  const handleDeleteQuote = async (quoteId) => {
    try {
      setDeletingQuoteId(quoteId);
      await deleteQuote(supabase, quoteId);
      setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== quoteId));
    } catch (error) {
      console.error("Error deleting quote:", error);
      alert("An error occurred while deleting the quote. Please try again.");
    } finally {
      setDeletingQuoteId(null);
    }
  };

  const getFileExtension = (url) => {
    if (!url) return "";
    const parts = url.split(".");
    return parts[parts.length - 1].toLowerCase();
  };

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
                <Badge variant="solid" colorScheme="blue">
                  {quote.quote_files.length}
                </Badge>
              </HStack>
              {quote.quote_files.map((file) => (
                <Box key={file.id} display="flex" alignItems="center" mb={2}>
                  {file.file_url && (
                    <Box width="100px" height="100px" mr={4}>
                      {getFileExtension(file.file_url) === "pdf" ? (
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
                      ) : (
                        <Image
                          src={file.file_url}
                          alt={file.file_url}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                        />
                      )}
                    </Box>
                  )}
                  <Link href={file.file_url} isExternal>
                    <Text color="blue.500" fontWeight="bold" cursor="pointer">
                      {file.file_url}
                    </Text>
                  </Link>
                </Box>
              ))}
            </VStack>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => handleDeleteQuote(quote.id)}
            >
              Delete
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}