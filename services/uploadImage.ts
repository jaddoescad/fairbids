import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePathServer } from "./revalidatePath";

export const uploadImage = async (
  supabase: SupabaseClient,
  file: File,
  userId: string,
  jobId: string,
  fileType: string
) => {
  const imageId = uuidv4();
  const filePath = `${jobId}/${fileType}/${file.name}`;

  // check if file is empty
  if (!file) {
    throw new Error("No file selected");
  }

  if (!userId) {
    throw new Error("User not found");
  }

  if (!filePath) {
    throw new Error("File path not found");
  }

  // check if file is an image
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    throw new Error("File is not an image");
  }

  // check if file size is greater than 2MB
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    throw new Error("Image must smaller than 2MB!");
  }

  // const fileExt = file.name.split(".").pop();
  // const fileName = `${jobId}/job_images/${imageId}.${fileExt}`;
  // const filePath = `${fileName}`;

  let { error: uploadError, data } = await supabase.storage
    .from("job_files")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data: imageData } = supabase.storage
    .from("job_files")
    .getPublicUrl(filePath, {
      transform: {
        width: 200,
        height: 200,
      },
    });

  const { error: insertError } = await supabase.from("job_files").insert({
    job_id: jobId,
    file_type: fileType,
    file_url: imageData.publicUrl,
  });

  if (insertError) {
    throw insertError;
  }

  revalidatePathServer(jobId);
  return imageData.publicUrl;
};