import { createClient } from "@/utils/supabase/client";

export async function getJobById(jobId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) {
    console.error("Error fetching job data", error);
    return null;
  }

  return data;
}