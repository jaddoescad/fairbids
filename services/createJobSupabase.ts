
import { createClient } from "@/utils/supabase/client";

export async function saveJobToSupabase(supabase, title, category, location, userId) {
  

  const { data, error } = await supabase
    .from("jobs")
    .insert([
      {
        title,
        category,
        location,
        user_id: userId,
      },
    ])
    .select("*");

  if (error) {
    console.error("Error inserting data", error);
    return null;
  }

  return data[0];
}