// Quotes.js
"use client";
import { useState } from "react";
import { AddQuoteDialog } from "./AddQuoteDialog";
import { QuotesList } from "./QuotesList";
import { TopTitle } from "./FormReusable/TopTitle";
import { Text } from "@chakra-ui/react";

// Quotes.js
export function Quotes({ jobId, initialQuotes, setQuotes, setQuotesToDelete, errorMessage}) {
  const [quotes, setLocalQuotes] = useState(initialQuotes || []);

  const handleQuoteAdd = (newQuote) => {
    const updatedQuotes = [...quotes, newQuote];
    setLocalQuotes(updatedQuotes);
    setQuotes(updatedQuotes);
  };

  return (
    <>
      <TopTitle>Quotes</TopTitle>
      <AddQuoteDialog jobId={jobId} onAdd={handleQuoteAdd} />
      <QuotesList quotes={quotes} setQuotes={setLocalQuotes} setQuotesToDelete={setQuotesToDelete}/>
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
    </>
  );
}