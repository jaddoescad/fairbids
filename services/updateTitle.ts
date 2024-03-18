'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";



export async function updateJobTitle(jobId, newTitle) {
    const cookieStore = cookies()

    const supabase = createClient(cookieStore);
    const { error } = await supabase
      .from('jobs')
      .update({ title: newTitle })
      .eq('id', jobId);
  
    if (error) {
      console.error('Error updating job title', error);
      throw error;
    }

    revalidatePath('/job/' + jobId);

    
    
  }