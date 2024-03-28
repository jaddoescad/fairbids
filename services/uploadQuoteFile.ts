import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { revalidatePathServer } from "./revalidatePath";

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

    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from('job_files')
      .getPublicUrl(filePath, {
        transform: {
          width: 200,
          height: 200,
        }
      });

    if (publicUrlError) {
      throw publicUrlError;
    }

    const { error: insertError } = await supabase
      .from('quote_files')
      .insert({
        quote_id: quoteId,
        file_url: publicUrlData.publicUrl,
      });

    if (insertError) {
      throw insertError;
    }

    revalidatePathServer(jobId);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const uploadQuoteFiles = async (supabase, files, jobId, quoteId) => {
  const uploadPromises = files.map((file) =>
    uploadQuoteFile(supabase, file, jobId, quoteId)
  );

  const fileUrls = await Promise.all(uploadPromises);
  return fileUrls;
};

export const addQuote = async (supabase, jobId, quoteTitle, quoteValue, files) => {
  try {
    console.log("Adding quote to job:", jobId);
    const { data: quoteData, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        job_id: jobId,
        title: quoteTitle,
        value: quoteValue, // Add the quote value to the database
      })
      .select('*');
    if (quoteError) {
      throw quoteError;
    }

    let fileUrls = [];
    if (files.length > 0) {
      fileUrls = await uploadQuoteFiles(supabase, files, jobId, quoteData[0].id);
    }

    revalidatePathServer(jobId);
    return {
      ...quoteData[0],
      quote_files: fileUrls,
    };
  } catch (error) {
    console.error("Error adding quote:", error);
    throw error;
  }
};