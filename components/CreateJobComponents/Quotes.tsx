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
import { AddQuoteDialog } from "./AddQuoteDialog";
import { QuotesList } from "./QuoteList";

export function Quotes({ jobId }) {
  const [newQuote, setNewQuote] = useState(null);

  const handleQuoteAdd = (quoteData) => {
    setNewQuote(quoteData);
  };

  return (
    <>
      <AddQuoteDialog jobId={jobId} onAdd={handleQuoteAdd} />
      <QuotesList jobId={jobId} onAdd={newQuote} />
    </>
  );
}
