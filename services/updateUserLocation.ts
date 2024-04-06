// services/userProfileService.js
import { createClient } from "@/utils/supabase/client";

async function updateUserLocation(userId, location) {
  const supabase = createClient();
  console.log("hello");

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      location: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user location", error);
    throw error;
  }

  return data;
}

export { updateUserLocation };