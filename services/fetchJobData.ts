// services/jobService.js
import { createClient } from "@/utils/supabase/client";

async function fetchJobData(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(`*, job_files(file_path, file_type), user_profiles(display_name)`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching job data", error);
    return null;
  }

  const jobFiles = await Promise.allSettled(
    data.job_files.map(async (file) => {
      const { data: fileData, error: fileError } = await supabase.storage
        .from("job_files")
        .getPublicUrl(file.file_path, {
          transform: {
            width: 200,
            height: 200,
          },
        });

      if (fileError) {
        console.error("Error fetching file URL", fileError);
        return null;
      }

      return {
        ...file,
        file_url: fileData.publicUrl,
      };
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
          const { data: fileData, error: fileError } = await supabase.storage
            .from("job_files")
            .getPublicUrl(file.file_path);

          if (fileError) {
            console.error("Error fetching file URL", fileError);
            return null;
          }

          return {
            ...file,
            file_url: fileData.publicUrl,
          };
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
    display_name: data.user_profiles?.display_name ?? null,
  };
}

export { fetchJobData };

async function fetchNearestJobs(location, limit = 10) {
  const supabase = createClient();

  if (
    location.latitude === undefined ||
    location.longitude === undefined
  ) {
    console.error("Invalid location");
    return [];
  }

  const { data, error } = await supabase.rpc('nearby_jobs', {
    user_lat: location.latitude,
    user_long: location.longitude,
    lim: 10,
  });

  if (error) {
    console.error("Error fetching nearby jobs", error);
    return [];
  }

  return data;
}

export { fetchNearestJobs };