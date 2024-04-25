"use client";
import {
  Box,
  Button,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormLabel,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { createClient } from "@/utils/supabase/client";

export function AddQuoteDialog({
  jobId,
  onAdd,
}: {
  jobId: string;
  onAdd: (newQuote: any) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [quoteTitle, setQuoteTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [quoteValue, setQuoteValue] = useState("");
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const formatQuoteValue = (value: string) => {
    if (value === "") return "";
  
    // Remove any non-digit characters from the input value
    const sanitizedValue = value.replace(/\D/g, "");
  
    // Convert the sanitized value to a number
    const formattedValue = Number(sanitizedValue);
  
    // Return the formatted value as a whole number
    return formattedValue.toString();
  };

  const handleAddClick = () => {
    const newQuote = {
      title: quoteTitle,
      value: quoteValue,
      quote_files: files,
    };
    onAdd(newQuote);
    handleClose();
  };

  const handleClose = () => {
    setQuoteTitle("");
    setQuoteValue("");
    setFiles([]);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const selectedFiles = Array.from(fileList);
      // Check the number of selected files
      if (selectedFiles.length + files.length > 5) {
        alert("You can select a maximum of 5 files.");
        return;
      }

      // Check the size and type of each file
      const validFiles = selectedFiles.filter((file) => {
        const fileSize = file.size / 1024 / 1024; // Convert bytes to MB
        const fileType = file.type;

        if (fileSize > 50) {
          alert(`File "${file.name}" exceeds the maximum size of 50MB.`);
          return false;
        }

        if (!fileType.startsWith("image/") && fileType !== "application/pdf") {
          alert(`File "${file.name}" is not an image or PDF.`);
          return false;
        }

        return true;
      });

      setFiles([...files, ...validFiles]);
    }
  };

  const FileList = ({ files }: { files: File[] }) => {
    return (
      <Box mt={4}>
        {files.map((file: File, index: number) => (
          <Box key={index} display="flex" alignItems="center" mb={2}>
            <Box width="100px" height="100px" mr={4}>
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
              )}
            </Box>
            <Text
              color="blue.500"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => {
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, "_blank");
              }}
            >
              {file.name}
            </Text>
          </Box>
        ))}
      </Box>
    );
  };
  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="gray"
        onClick={onOpen}
        w="500px"
        py={6}
        justifyContent="flex-start"
        fontSize={"md"}
        borderRadius="14"
      >
        Add a quote
      </Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Add Quote</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Box width="full">
                  <FormLabel>Quote Title</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="Enter quote title"
                    value={quoteTitle}
                    onChange={(e) => setQuoteTitle(e.target.value)}
                  />
                </Box>
                <Box width="full">
                  <FormLabel>Quote Value</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.4500"
                      fontSize="1.2em"
                    >
                      $
                    </InputLeftElement>
                    <Input
                      placeholder="Enter quote value"
                      value={quoteValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        const formattedValue = formatQuoteValue(value);
                        setQuoteValue(formattedValue);
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box width="full">
                  <FormLabel>Quote Files</FormLabel>
                  <Box
                    borderColor="gray.300"
                    borderStyle="dashed"
                    borderWidth="2px"
                    rounded="md"
                    shadow="sm"
                    transition="all 150ms ease-in-out"
                    _hover={{ shadow: "md" }}
                    p={4}
                    cursor="pointer"
                    position="relative"
                  >
                    <Center>
                      <VStack spacing={2}>
                        <FaUpload size={24} />
                        <Text>
                          {files.length > 0
                            ? `${files.length} file(s) selected`
                            : "Drag and drop files here or click to upload"}
                        </Text>
                      </VStack>
                    </Center>
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      height="100%"
                      width="100%"
                    >
                      <Input
                        type="file"
                        multiple
                        accept="image/*, application/pdf"
                        opacity={0}
                        height="100%"
                        width="100%"
                        cursor="pointer"
                        onChange={handleFileChange}
                      />
                    </Box>
                  </Box>
                </Box>
                <FileList files={files} />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => {
                  handleAddClick();
                }}
                isLoading={isLoading}
                loadingText="Adding quote..."
                colorScheme="blue"
                ml={3}
              >
                Add Quote
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
