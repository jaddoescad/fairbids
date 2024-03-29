// Quotes.js
"use client";
import { useState } from "react";
import { AddQuoteDialog } from "./AddQuoteDialog";
import { QuotesList } from "./QuotesList";
import { TopTitle } from "./FormReusable/TopTitle";

export function Quotes({ jobId, initialQuotes }) {
  const [newQuote, setNewQuote] = useState(null);

const handleQuoteAdd = async (quoteData) => {
  setNewQuote(quoteData);
};
  return (
    <>
      <TopTitle>Quotes</TopTitle>
      <AddQuoteDialog jobId={jobId} onAdd={handleQuoteAdd} />
      <QuotesList initialQuotes={initialQuotes} onAdd={newQuote} />
    </>
  );
}
