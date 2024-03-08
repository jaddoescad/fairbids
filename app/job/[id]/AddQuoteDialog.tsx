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

export function AddQuoteDialog({ onAddQuote }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [quoteTitle, setQuoteTitle] = useState(""); // Separate state for quote title
  const [quoteText, setQuoteText] = useState(""); // Separate state for quote text
  const [file, setFile] = useState(null); // State for uploaded file

  const handleAddClick = () => {
    console.log("Adding quote", quoteTitle, quoteText);
    // Assuming you want to add both the quote title and text
    onAddQuote({ title: quoteTitle, text: quoteText });
    onClose(); // Close the dialog
  };
  // Function to handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Assuming single file upload
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
        <AlertDialogOverlay>
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
                <Box>
                  Quote
                  <Input
                    placeholder="Enter quote text"
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                  />
                </Box>
                <Box width="full">
                  Upload File
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaUpload />
                    </InputLeftElement>
                    <Input
                      type="file"
                      p={1}
                      pl={10} // Padding to make room for the icon
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
