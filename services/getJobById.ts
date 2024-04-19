import { createClient } from "@/utils/supabase/client";

export async function getJobById(jobId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();


  return data;
}