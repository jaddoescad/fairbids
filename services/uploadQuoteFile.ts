import { createClient } from "@/utils/supabase/client";
import { revalidateEditJobPathServer } from "./revalidatePath";

const uploadQuoteFile = async (supabase, file, jobId, quoteId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${jobId}/quotes/${quoteId}/files/${Date.now()}.${fileExt}`;
    const { error: uploadError, data } = await supabase.storage
      .from('job_files')
      .upload(filePath, file);
    if (uploadError) {
      throw uploadError;
    }
    const { error: insertError } = await supabase
      .from('quote_files')
      .insert({
        quote_id: quoteId,
        file_path: filePath,
      });
    if (insertError) {
      throw insertError;
    }
    const { data: publicUrlData, error: publicUrlError } = await supabase.storage
      .from('job_files')
      .getPublicUrl(filePath);
    if (publicUrlError) {
      throw publicUrlError;
    }
    revalidateEditJobPathServer(jobId);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const uploadQuoteFiles = async (supabase, files, jobId, quoteId) => {


  const uploadPromises = files.map((file) => uploadQuoteFile(supabase, file, jobId, quoteId));
  const filePaths = await Promise.all(uploadPromises); // Rename to filePaths
  return filePaths;
};


export const deleteQuotes = async (supabase, quoteIds) => {
  try {
    const { data: deletedQuotes, error: deleteError } = await supabase
      .from("quotes")
      .delete()
      .in("id", quoteIds);

    if (deleteError) {
      throw deleteError;
    }

    return deletedQuotes;
  } catch (error) {
    console.error("Error deleting quotes:", error);
    throw error;
  }
};


export const uploadQuotes = async (quotes, jobId) => {
  const supabase = createClient();
  const uploadedQuotes = await Promise.all(
    quotes.map(async (quote) => {
      const { data: quoteData, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          job_id: jobId,
          title: quote.title,
          value: quote.value,
        })
        .select("*");

      if (quoteError) {
        console.error("Error uploading quote:", quoteError);
        throw quoteError;
      }

      const fileUrls = await uploadQuoteFiles(
        supabase,
        quote.quote_files,
        jobId,
        quoteData[0].id
      );
      return {
        ...quoteData,
        quote_files: fileUrls,
      };
    })
  );
  revalidateEditJobPathServer(jobId);
  return uploadedQuotes;
};