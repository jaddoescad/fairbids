import { SupabaseClient } from '@supabase/supabase-js';

export async function saveJobToSupabase(
  supabase: SupabaseClient,
  title: string,
  address: string,
  latitude: number,
  longitude: number,
  userId: string
) {
  const { data, error } = await supabase
    .from("jobs")
    .insert([
      {
        title,
        address,
        latitude,
        longitude,
        user_id: userId,
      },
    ])
    .select("*");

  if (error) {
    console.error("Error inserting data", error);
    throw error;
    return null;
  }

  return data[0];
}