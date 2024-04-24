import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';
import { revalidateEditJobPathServer } from "./revalidatePath";

// services/uploadImageService.js
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
    return filePath;
  });
  const uploadedFilePaths = await Promise.all(uploadPromises);

  const publicUrlPromises = uploadedFilePaths.map(async (filePath) => {
    const { data: fileData } = await supabase.storage
      .from("job_files")
      .getPublicUrl(filePath, {
        transform: {
          width: 200,
          height: 200,
        },
      });

    return { publicUrl: fileData.publicUrl, filePath };
  });

  const publicUrlsWithFilePaths = await Promise.all(publicUrlPromises);
  const filteredPublicUrlsWithFilePaths = publicUrlsWithFilePaths.filter(
    (urlWithPath) => urlWithPath !== null
  );

  return filteredPublicUrlsWithFilePaths;
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

  const { error: insertError } = await supabase.from("job_files").insert({
    job_id: jobId,
    file_type: fileType,
    file_path: filePath, // Store the file path instead of the public URL
  });

  if (insertError) {
    throw insertError;
  }

  revalidateEditJobPathServer(jobId);

  return filePath; // Return the file path
};

export const deleteImages = async (filePaths: string[], jobId: string) => {
  const supabase = createClient();

  const deletePromises = filePaths.map(async (filePath) => {
    if (filePath) {
      await supabase.storage.from("job_files").remove([filePath]);
      await supabase.from("job_files").delete().eq("file_path", filePath);
    }
  });

  await Promise.all(deletePromises);

  revalidateEditJobPathServer(jobId);

  return;
};