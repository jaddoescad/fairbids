"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';


export function JobFormClient() {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim() === "") return;
    router.push(`/create-job/category?title=${encodeURIComponent(title)}`);

  };




  return (
    <div className="pt-4">
      <form
        onSubmit={handleSubmit}
        className={
          "animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        }
      >
        <input
          className="rounded-md px-4 py-2 bg-inherit border"
          name="quote"
          type="text"
          placeholder="Write your quote here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
          Next
        </button>
      </form>
    </div>
  );
}
