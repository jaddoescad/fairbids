import { SupabaseClient } from "@supabase/supabase-js";
import { revalidateEditJobPathServer } from "./revalidatePath";
import { createClient } from "@/utils/supabase/client";
import { ImageType } from "@/types/types";

export const uploadImages = async (
  files: ImageType[],
  userId: string,
  jobId: string,
  imageType: string
) => {
  const supabase = createClient();
  const uploadPromises = files.map(async (file) => {
    const filePath = await uploadImage(
      supabase,
      file.file!,
      userId,
      jobId,
      imageType
    );
    return { filePath, fileType: imageType };
  });
  const uploadedFilePaths = await Promise.all(uploadPromises);
  return uploadedFilePaths;
};

const uploadImage = async (
  supabase: SupabaseClient,
  file: File,
  userId: string,
  jobId: string,
  fileType: string
) => {
  const filePath = `${userId}/${jobId}/${fileType}/${file.name}`;

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
  const isLt2M = file.size / 1024 / 1024 < 50;
  if (!isLt2M) {
    throw new Error("Image must smaller than 50MB!");
  }

  let { error: uploadError, data } = await supabase.storage
    .from("job_files")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  revalidateEditJobPathServer(jobId);

  return filePath; // Return the file path
};

export const deleteImages = async (filePaths: string[], jobId: string) => {
  const supabase = createClient();

  const deletePromises = filePaths.map(async (filePath) => {
    if (filePath) {
      await supabase.from("job_files").delete().eq("file_path", filePath);
      await supabase.storage.from("job_files").remove([filePath]);
    }
  });

  await Promise.all(deletePromises);

  revalidateEditJobPathServer(jobId);

  return;
};