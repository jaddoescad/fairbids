"use server";

// import { JobDetails } from "@/types/types";
// import { createClient } from "@/utils/supabase/server";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";

// export async function updateJobDetails(
//   updatedJob: JobDetails,
//   uploadedFiles: { filePath: string; fileType: string }[]
// ) {
//   const cookieStore = cookies();
//   const supabase = createClient(cookieStore);
//   const { error: updateError } = await supabase
//     .from("jobs")
//     .update({
//       title: updatedJob.title,
//       address: updatedJob.location.address,
//       latitude: updatedJob.location.latitude,
//       longitude: updatedJob.location.longitude,
//       description: updatedJob.description,
//       published: true,
//     })
//     .eq("id", updatedJob.id);
//   if (updateError) {
//     console.error("Error updating job details", updateError);
//     throw updateError;
//   }
//   const { error: insertError } = await supabase.from("job_files").insert(
//     uploadedFiles.map((file) => ({
//       job_id: updatedJob.id,
//       file_type: file.fileType,
//       file_path: file.filePath,
//     }))
//   );
//   if (insertError) {
//     console.error("Error inserting job files", insertError);
//     throw insertError;
//   }
//   revalidatePath("/edit-job/" + updatedJob.id);
// }

import { JobDetails } from "@/types/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateJobDetails(
  updatedJob: JobDetails,
  uploadedFiles: { filePath: string; fileType: string }[],
  uploadedQuoteFiles: { title: string; value: number; quote_files: string[] }[]
) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error: transactionError } = await supabase.rpc("update_job_details", {
    p_job_id: updatedJob.id,
    p_title: updatedJob.title,
    p_address: updatedJob.location.address,
    p_latitude: updatedJob.location.latitude,
    p_longitude: updatedJob.location.longitude,
    p_description: updatedJob.description,
    p_published: true,
    p_uploaded_files: uploadedFiles.map((file) => ({
      file_type: file.fileType,
      file_path: file.filePath,
    })),
    p_quotes: uploadedQuoteFiles,
  });
  if (transactionError) {
    console.error("Error updating job details", transactionError);
    throw transactionError;
  }

  revalidatePath("/edit-job/" + updatedJob.id);
}