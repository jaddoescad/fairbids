"use client";

import { addQuote } from "../../services/uploadQuoteFile";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  VStack, // For vertical stacking of form elements
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa"; // Importing an upload icon
import { createClient } from "@/utils/supabase/client";

export function AddQuoteDialog({ jobId, onAdd }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [quoteTitle, setQuoteTitle] = useState(""); // Separate state for quote title
  const [quoteText, setQuoteText] = useState(""); // Separate state for quote text
  const [files, setFiles] = useState([]); // State for uploaded files
  const supabase = createClient();

const handleAddClick = async () => {
  try {
    const quoteData = await addQuote(supabase, jobId, quoteTitle, files);
    onAdd(quoteData); // Pass the complete quote data, including quote_files
    onClose();
  } catch (error) {
    console.error('Error adding quote:', error);
  }
};
  // Function to handle file selection
  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files)); // Update to handle multiple files
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Add Quote
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay color={"black"}>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add Quotes
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack spacing={4}>
                <Box>
                  Title
                  <Input
                    placeholder="Enter quote title"
                    value={quoteTitle}
                    onChange={(e) => setQuoteTitle(e.target.value)}
                  />
                </Box>

                <Box width="full">
                  Upload Files
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaUpload />
                    </InputLeftElement>
                    <Input
                      type="file"
                      multiple // Add multiple attribute to allow multiple file selection
                      p={1}
                      pl={10}
                      onChange={handleFileChange}
                    />
                  </InputGroup>
                </Box>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Adding quote", quoteTitle, quoteText);
                  handleAddClick();
                  onClose();
                }}
                colorScheme="red"
                ml={3}
              >
                Add Quote
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
