import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePathServer } from "./revalidatePath";

// services/uploadImageService.js
import { createClient } from "@/utils/supabase/client";

export const uploadImages = async (files, userId, jobId, imageType) => {
  const supabase = createClient();

  const uploadPromises = files.map(async (file) => {
    const filePath = await uploadImage(supabase, file, userId, jobId, imageType);
    return filePath;
  });

  const uploadedFilePaths = await Promise.all(uploadPromises);

  const publicUrlPromises = uploadedFilePaths.map(async (filePath) => {
    const { data: fileData, error: fileError } = await supabase.storage
      .from("job_files")
      .getPublicUrl(filePath, {
        transform: {
          width: 200,
          height: 200,
        },
      });

    if (fileError) {
      console.error("Error fetching file URL", fileError);
      return null;
    }

    return fileData.publicUrl;
  });

  const publicUrls = await Promise.all(publicUrlPromises);
  const filteredPublicUrls = publicUrls.filter((url) => url !== null);

  return filteredPublicUrls;
};

const uploadImage = async (
  supabase: SupabaseClient,
  file: File,
  userId: string,
  jobId: string,
  fileType: string
) => {
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

  revalidatePathServer(jobId);

  return filePath; // Return the file path
};