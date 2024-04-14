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
async function fetchNearestJobs(location, limit = 2, offset = 0) {
  const supabase = createClient();

  if (location.latitude === undefined || location.longitude === undefined) {
    console.error("Invalid location");
    return [];
  }

  const { data, error } = await supabase.rpc('get_nearby_jobs', {
    user_lat: location.latitude,
    user_long: location.longitude,
    lim: limit,
    off: offset,
  });

  if (error) {
    console.error("Error fetching nearby jobs", error);
    return [];
  }

  const jobsWithImages = await Promise.all(
    data.map(async (job) => {
      const imageUrls = await Promise.all(
        job.image_urls.map(async (filePath) => {
          const { data: fileData, error: fileError } = await supabase.storage
            .from("job_files")
            .getPublicUrl(filePath, {
              transform: {
                width: 500,
                height: 500,
              },
            });

          if (fileError) {
            console.error("Error fetching file URL", fileError);
            return null;
          }

          return fileData.publicUrl;
        })
      );

      return {
        ...job,
        imageUrls: imageUrls.filter(Boolean),
      };
    })
  );

  return jobsWithImages;
}

export { fetchNearestJobs };


async function fetchQueryData(query) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('search_jobs', { query });

  if (error) {
    console.error("Error fetching job data", error);
    return null;
  }

  return data;
}

export { fetchQueryData };


async function searchNearbyJobs(query, latitude, longitude, lim = 10) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('search_nearby_jobs', {
    lim: lim,
    query: query,
    user_lat: latitude,
    user_long: longitude
  });

  console.log("data", data);

  if (error) {
    console.error("Error fetching job data", error);
    return null;
  }

  const jobsWithImages = await Promise.all(
    data.map(async (job) => {
      const imageUrls = await Promise.all(
        job.image_urls.map(async (filePath) => {
          const { data: fileData, error: fileError } = await supabase.storage
            .from("job_files")
            .getPublicUrl(filePath, {
              transform: {
                width: 500,
                height: 500,
              },
            });
          if (fileError) {
            console.error("Error fetching file URL", fileError);
            return null;
          }
          return fileData.publicUrl;
        })
      );
      return { ...job, imageUrls: imageUrls.filter(Boolean) };
    })
  );

  console.log("jobsWithImages", jobsWithImages);

  return jobsWithImages;
}

export { searchNearbyJobs };


async function fetchUserJobs(userId) {
  const supabase = createClient();

  const { data: jobsData, error: jobsError } = await supabase
    .from("jobs")
    .select(`*, job_files(file_path, file_type), quotes(*, quote_files(file_path))`)
    .eq("user_id", userId);

  if (jobsError) {
    console.error("Error fetching user jobs", jobsError);
    return [];
  }

  const jobsWithImagesAndQuotes = await Promise.all(
    jobsData.map(async (job) => {
      const imageUrls = await Promise.all(
        job.job_files.map(async (file) => {
          const { data: fileData, error: fileError } = await supabase.storage
            .from("job_files")
            .getPublicUrl(file.file_path, {
              transform: {
                width: 500,
                height: 500,
              },
            });

          if (fileError) {
            console.error("Error fetching file URL", fileError);
            return null;
          }

          return fileData.publicUrl;
        })
      );

      const quotesWithFiles = await Promise.all(
        job.quotes.map(async (quote) => {
          const quoteFileUrls = await Promise.all(
            quote.quote_files.map(async (file) => {
              const { data: fileData, error: fileError } = await supabase.storage
                .from("job_files")
                .getPublicUrl(file.file_path);

              if (fileError) {
                console.error("Error fetching file URL", fileError);
                return null;
              }

              return fileData.publicUrl;
            })
          );

          return {
            ...quote,
            quote_files: quoteFileUrls.filter(Boolean),
          };
        })
      );

      const quoteCount = quotesWithFiles.length;
      const averageQuoteValue = quotesWithFiles.reduce((sum, quote) => sum + quote.value, 0) / quoteCount;

      return {
        ...job,
        imageUrls: imageUrls.filter(Boolean),
        quotes: quotesWithFiles,
        quote_count: quoteCount,
        average_quote_value: averageQuoteValue,
      };
    })
  );

  return jobsWithImagesAndQuotes;
}

export { fetchUserJobs };