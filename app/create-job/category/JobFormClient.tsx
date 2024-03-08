"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Select } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";

export function JobFormClient({
}) {

  const router = useRouter();
  const searchParams = useSearchParams()
  const title = searchParams.get("title");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const category = e.target[0].value;

    if (category.trim() === "") return;
    router.push(`/create-job/location?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`);

    // router.push(`/create-job/location?title=${title}&category=${category}`);
  };

  return (
    <div className="pt-4">
      <form
        onSubmit={handleSubmit}
        className={
          "animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        }
      >
        <Select
          placeholder="Select category"
          className="rounded-md px-4 py-2 bg-inherit border"
        >
          <option value="kitchen">Kitchen</option>
          <option value="bathroom">Bathroom</option>
          <option value="full-house-renovation">Full House Renovation</option>
          <option value="other">Other</option>
        </Select>
        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
          Next
        </button>
      </form>
    </div>
  );
}
