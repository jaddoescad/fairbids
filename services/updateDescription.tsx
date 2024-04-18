'use server'
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateJobDescription(jobId: string, newDescription: string) {
    const cookieStore = cookies();
  
    const supabase = createClient(cookieStore);
    const { error } = await supabase
      .from('jobs')
      .update({ description: newDescription })
      .eq('id', jobId);
  
    if (error) {
      console.error('Error updating job description', error);
      throw error;
    }
  
    revalidatePath('/edit-job/' + jobId);
  }