// services/jobService.ts
import { createClient } from "@/utils/supabase/client";

async function fetchUserJobs(userId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, location")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user jobs", error);
    return [];
  }

  return data;
}

export { fetchUserJobs };