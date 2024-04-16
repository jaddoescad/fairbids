// services/userProfileService.js
import { Location } from "@/types/types";
import { createClient } from "@/utils/supabase/client";

async function updateUserLocation(userId: string, location: Location) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      address: location.address,
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