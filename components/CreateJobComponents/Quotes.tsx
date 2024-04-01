// Quotes.js
"use client";
import { useState } from "react";
import { AddQuoteDialog } from "./AddQuoteDialog";
import { QuotesList } from "./QuotesList";
import { TopTitle } from "./FormReusable/TopTitle";

// Quotes.js
export function Quotes({ jobId, initialQuotes, setQuotes, setQuotesToDelete }) {
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
    </>
  );
}