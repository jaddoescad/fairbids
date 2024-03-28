"use client";

import { useState } from "react";
import { AddQuoteDialog } from "./AddQuoteDialog";
import { QuotesList } from "./QuoteList";
import { Text } from "@chakra-ui/react";
import { TopTitle } from "./FormReusable/TopTitle";

export function Quotes({ jobId, initialQuotes }) {
    const [newQuote, setNewQuote] = useState(null);
  
    const handleQuoteAdd = (quoteData) => {
      setNewQuote(quoteData);
    };
  
    return (
      <>
        <TopTitle>
          Quotes
        </TopTitle>
        <AddQuoteDialog jobId={jobId} onAdd={handleQuoteAdd} />
        <QuotesList
          jobId={jobId}
          initialQuotes={initialQuotes}
          onAdd={newQuote}
        />
      </>
    );
  }