import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (
  supabase: SupabaseClient,
  file: File,
  jobId: string,
  userId: string
) => {
  const imageId = uuidv4();
  // check if file is empty
  if (!file) {
    throw new Error("No file selected");
  }

  if (jobId === "" || jobId === undefined || jobId === null) {
    throw new Error("No job id");
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

  const fileExt = file.name.split(".").pop();
  const fileName = `${jobId}/job_images/${imageId}.${fileExt}`;
  const filePath = `${fileName}`;

  let { error: uploadError, data } = await supabase.storage
    .from("job_images")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data: imageData } = supabase.storage
    .from("job_images")
    .getPublicUrl(`${userId}/jobs/${jobId}/job_images/${imageId}.${fileExt}`);


  return imageData.publicUrl;
};