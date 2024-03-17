// QuotesList.js
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function QuotesList({ jobId, onAdd }) {
  const [quotes, setQuotes] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    if (onAdd) {
      setQuotes((prevQuotes) => [...prevQuotes, onAdd]);
    }
  }, [onAdd]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const { data: quotesData, error: quotesError } = await supabase
          .from("quotes")
          .select("*, quote_files(file_url)")
          .eq("job_id", jobId);

        if (quotesError) {
          throw quotesError;
        }

        setQuotes(quotesData);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchQuotes();
  }, [jobId, supabase]);

  return (
    <div>
      <h3>Quotes</h3>
      {quotes.map((quote) => (
        <div key={quote.id}>
          <p>Title: {quote.title}</p>
          <p>Attachments: {quote.quote_files.length}</p>
        </div>
      ))}
    </div>
  );
}
