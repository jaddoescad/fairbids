"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateJobDetails(updatedJob) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("jobs")
    .update({
      title: updatedJob.title,
      category: updatedJob.category,
      location: updatedJob.location,
      description: updatedJob.description,
    })
    .eq("id", updatedJob.id);

  if (error) {
    console.error("Error updating job details", error);
    throw error;
  }

  revalidatePath("/edit-job/" + updatedJob.id);
}