"use server";
//create function to revalidate path

"use server";

import { revalidatePath } from "next/cache";

export async function revalidateEditJobPathServer(jobId: string) {
  revalidatePath("/edit-job/" + jobId);
}

export async function revalidateJobPathServer(jobId: string) {
  revalidatePath("/job/" + jobId);
}