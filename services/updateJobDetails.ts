"use server";

import { JobDetails } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateJobDetails(updatedJob: JobDetails) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);


  const { error } = await supabase
    .from("jobs")
    .update({
      title: updatedJob.title,
      category: updatedJob.category,
      address: updatedJob.location.address,
      latitude: updatedJob.location.latitude,
      longitude: updatedJob.location.longitude,
      description: updatedJob.description,
      published: true
    })
    .eq("id", updatedJob.id);

  if (error) {
    console.error("Error updating job details", error);
    throw error;
  }

  revalidatePath("/edit-job/" + updatedJob.id);
}