// QuotesList.js
"use client";

import { useEffect, useState } from "react";


export function QuotesList({ jobId, initialQuotes, onAdd }) {
    const [quotes, setQuotes] = useState(initialQuotes || []);
  
    useEffect(() => {
      if (onAdd) {
        setQuotes((prevQuotes) => [...prevQuotes, onAdd]);
      }
    }, [onAdd]);
  
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