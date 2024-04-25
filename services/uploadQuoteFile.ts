import { createClient } from "@/utils/supabase/client";
import { revalidateEditJobPathServer } from "./revalidatePath";
import { SupabaseClient } from "@supabase/supabase-js";
import { Quote } from "@/types/types";

const uploadQuoteFile = async (
  supabase: SupabaseClient,
  file: File,
  jobId: string,
  userId: string
) => {
  try {
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/${jobId}/quotes/files/${Date.now()}.${fileExt}`;
    const { error: uploadError, data } = await supabase.storage
      .from("job_files")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
export const uploadQuoteFiles = async (
  supabase: SupabaseClient,
  quotes: Quote[],
  jobId: string,
  userId: string
) => {
  // Filter out the quotes that already have an id (existing quotes)
  const localQuotes = quotes.filter((quote: Quote) => !quote.id);

  const uploadPromises = localQuotes.map(async (quote: Quote) => {
    const fileObjects = quote.quote_files.filter(
      (file): file is File => file instanceof File
    );
    const filePaths = await Promise.all(
      fileObjects.map((file) => uploadQuoteFile(supabase, file, jobId, userId))
    );
    return {
      title: quote.title,
      value: quote.value,
      quote_files: filePaths, // Use the filePaths array directly
    };
  });

  const uploadedQuoteFiles = await Promise.all(uploadPromises);
  return uploadedQuoteFiles;
};

export const deleteQuotes = async (
  supabase: SupabaseClient,
  quoteIds: string[]
) => {
  const { data: deletedQuotes, error: deleteError } = await supabase
    .from("quotes")
    .delete()
    .in("id", quoteIds);

  return deletedQuotes;
};
