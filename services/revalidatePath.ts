"use server";
//create function to revalidate path

"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePathServer(jobId) {
  revalidatePath("/edit-job/" + jobId);
}
