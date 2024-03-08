"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { JobFormClient } from "./JobFormClient";

export default function Page() {
  
  return (
    <div
      className="max-w-4xl w-full"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Create New Job</h2>

      <JobFormClient/>
    </div>
  );
}
