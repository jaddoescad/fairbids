// Quotes.tsx
"use client";
import { useState } from "react";
import { AddQuoteDialog } from "./AddQuoteDialog";
import { QuotesList } from "./QuotesList";
import { TopTitle } from "./FormReusable/TopTitle";
import { Text } from "@chakra-ui/react";
import { Quote } from "@/types/types";

export function Quotes({
  jobId,
  initialQuotes,
  setQuotes,
  setQuotesToDelete,
  errorMessage,
}: {
  jobId: string;
  initialQuotes: Quote[];
  setQuotes: (quotes: Quote[]) => void;
  setQuotesToDelete: (quotesToDelete: Quote[]) => void;
  errorMessage?: string;
}) {
  const [quotes, setLocalQuotes] = useState<Quote[]>(initialQuotes || []);

  const handleQuoteAdd = (newQuote: Quote) => {
    const updatedQuotes = [...quotes, newQuote];
    setLocalQuotes(updatedQuotes);
    setQuotes(updatedQuotes);
  };

  return (
    <>
      <TopTitle>Quotes</TopTitle>
      <AddQuoteDialog jobId={jobId} onAdd={handleQuoteAdd} />
      <QuotesList
        quotes={quotes}
        setQuotes={setLocalQuotes}
        setQuotesToDelete={setQuotesToDelete}
      />
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
    </>
  );
}