// services/jobService.js
import { createClient } from "@/utils/supabase/client";

async function getJobFileUrl(supabase, filePath, transform = {}) {
  const { data: fileData, error: fileError } = await supabase.storage
    .from("job_files")
    .getPublicUrl(filePath, { transform });

  if (fileError) {
    console.error("Error fetching file URL", fileError);
    return null;
  }

  return fileData.publicUrl;
}

async function fetchJobData(id) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, job_files(file_path, file_type)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching job data", error);
    return null;
  }

  const jobFiles = await Promise.allSettled(
    data.job_files.map(async (file) => {
      const fileUrl = await getJobFileUrl(supabase, file.file_path, {
        width: 200,
        height: 200,
      });
      return { ...file, file_url: fileUrl };
    })
  );

  const { data: quotesData, error: quotesError } = await supabase
    .from("quotes")
    .select("*, quote_files(file_path)")
    .eq("job_id", id);

  if (quotesError) {
    console.error("Error fetching quotes data", quotesError);
  }

  const updatedQuotesData = await Promise.allSettled(
    quotesData.map(async (quote) => {
      const updatedQuoteFiles = await Promise.allSettled(
        quote.quote_files.map(async (file) => {
          const fileUrl = await getJobFileUrl(supabase, file.file_path);
          return { ...file, file_url: fileUrl };
        })
      );
      return {
        ...quote,
        quote_files: updatedQuoteFiles.map((result) => result.value).filter(Boolean),
      };
    })
  );

  return {
    ...data,
    job_files: jobFiles.map((result) => result.value).filter(Boolean),
    quotes: updatedQuotesData?.map((result) => result.value) ?? [],
  };
}

export { fetchJobData };