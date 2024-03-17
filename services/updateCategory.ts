

"use server";



import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";



export async function updateJobCategory(jobId, newCategory) {
    const cookieStore = cookies()

    const supabase = createClient(cookieStore);
    const { error } = await supabase
      .from('jobs')
      .update({ category: newCategory })
      .eq('id', jobId);
  
      if (error) {
        console.error('Error updating job title', error);
        throw error;
      }

    revalidatePath('/job/' + jobId);

    
    
  }