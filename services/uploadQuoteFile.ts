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
    
    const { error: insertError } = await supabase
      .from('quote_files')
      .insert({
        quote_id: quoteId,
        file_path: filePath, // Save the file path instead of the public URL
      });
    
    if (insertError) {
      throw insertError;
    }
    
    revalidatePathServer(jobId);
    return filePath; // Return the file path instead of the public URL
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

export const addQuote = async (supabase, jobId, quoteTitle, quoteValue, files) => {
  try {
    console.log("Adding quote to job:", jobId);
    const { data: quoteData, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        job_id: jobId,
        title: quoteTitle,
        value: quoteValue,
      })
      .select('*');

    if (quoteError) {
      throw quoteError;
    }

    let fileUrls = [];
    if (files.length > 0) {
      const filePaths = await uploadQuoteFiles(supabase, files, jobId, quoteData[0].id);
      fileUrls = await Promise.all(
        filePaths.map(async (filePath) => {
          const { data, error } = await supabase.storage
            .from("job_files")
            .getPublicUrl(filePath);
          if (error) {
            throw error;
          }
          return {
            file_path: filePath,
            file_url: data.publicUrl,
          };
        })
      );
    }

    revalidatePathServer(jobId);
    return { ...quoteData[0], quote_files: fileUrls };
  } catch (error) {
    console.error("Error adding quote:", error);
    throw error;
  }
};

export const deleteQuote = async (supabase, quoteId) => {
  try {
    const { data: deletedQuote, error: deleteError } = await supabase
      .from("quotes")
      .delete()
      .eq("id", quoteId)
      .single();

    if (deleteError) {
      throw deleteError;
    }

    return deletedQuote;
  } catch (error) {
    console.error("Error deleting quote:", error);
    throw error;
  }
};