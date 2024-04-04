export async function saveJobToSupabase(supabase, title, category, location, latitude, longitude, userId) {
  
  const { data, error } = await supabase
    .from("jobs")
    .insert([
      {
        title,
        category,
        location,
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