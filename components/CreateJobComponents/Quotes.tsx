"use client";

import { useState } from "react";
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
