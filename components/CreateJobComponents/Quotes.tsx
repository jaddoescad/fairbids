// Quotes.js
"use client";
import { useState } from "react";
import { AddQuoteDialog } from "./AddQuoteDialog";
import { QuotesList } from "./QuotesList";
import { Text } from "@chakra-ui/react";
import { TopTitle } from "./FormReusable/TopTitle";
import { createClient } from "@/utils/supabase/client";

export function Quotes({ jobId, initialQuotes }) {
  const [newQuote, setNewQuote] = useState(null);

  const fetchFileUrls = async (files) => {
    const supabase = createClient();
    const fileUrls = await Promise.all(
      files.map(async (file) => {
        const { data: fileData, error: fileError } = await supabase.storage
          .from("job_files")
          .getPublicUrl(file.file_url);
        if (fileError) {
          console.error("Error fetching file URL", fileError);
          return null;
        }
        const publicUrl = fileData.publicUrl;
        console.log("publicUrl", publicUrl);
        return { ...file, publicUrl };
      })
    );
    return fileUrls.filter((file) => file !== null);
  };

  const handleQuoteAdd = async (quoteData) => {
    const fileUrls = await fetchFileUrls(quoteData.quote_files);
    const updatedQuoteData = { ...quoteData, quote_files: fileUrls };
    setNewQuote(updatedQuoteData);
  };

  return (
    <>
      <TopTitle>Quotes</TopTitle>
      <AddQuoteDialog jobId={jobId} onAdd={handleQuoteAdd} />
      <QuotesList jobId={jobId} initialQuotes={initialQuotes} onAdd={newQuote} />
    </>
  );
}
