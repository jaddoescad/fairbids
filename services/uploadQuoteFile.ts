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
        file_url: filePath, // Save the file path instead of the public URL
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
    
    let filePaths = []; // Rename to filePaths
    if (files.length > 0) {
      filePaths = await uploadQuoteFiles(supabase, files, jobId, quoteData[0].id);
    }
    
    revalidatePathServer(jobId);
    
    return {
      ...quoteData[0],
      quote_files: filePaths, // Use filePaths instead of fileUrls
    };
  } catch (error) {
    console.error("Error adding quote:", error);
    throw error;
  }
};