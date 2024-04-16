// services/jobService.js
import { FileInfo, Job, Quote } from "@/types/types";
import { createClient } from "@/utils/supabase/client";
import { getUserId } from "./authServer";

async function fetchJobData(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(`*, job_files(file_path, file_type), user_profiles(display_name)`)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Error fetching job data");
  }

  const jobFiles = await Promise.allSettled(
    data.job_files.map(async (file: FileInfo) => {
      const { data: fileData } = await supabase.storage
        .from("job_files")
        .getPublicUrl(file.file_path, {
          transform: {
            width: 200,
            height: 200,
          },
        });

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
    throw new Error("Error fetching quotes data");
  }

  const updatedQuotesData = quotesData
    ? await Promise.allSettled(
        quotesData.map(async (quote) => {
          const updatedQuoteFiles = await Promise.allSettled(
            quote.quote_files.map(async (file: FileInfo) => {
              const { data: quoteData } = await supabase.storage
                .from("job_files")
                .getPublicUrl(file.file_path);

              return {
                ...file,
                file_url: quoteData.publicUrl,
              };
            })
          );

          return {
            ...quote,
            quote_files: updatedQuoteFiles
              .map((result) => {
                if (result.status === "fulfilled") {
                  return (result as PromiseFulfilledResult<any>).value;
                }
                return null;
              })
              .filter(Boolean),
          };
        })
      )
    : [];

  return {
    ...data,
    job_files: jobFiles
      .map((result) => {
        if (result.status === "fulfilled") {
          return (result as PromiseFulfilledResult<any>).value;
        }
        return null;
      })
      .filter(Boolean),
    quotes: updatedQuotesData
      .map((result) => {
        if (result.status === "fulfilled") {
          return (result as PromiseFulfilledResult<any>).value;
        }
        return null;
      })
      .filter(Boolean),
    display_name: data.user_profiles?.display_name ?? null,
  };
}

export { fetchJobData };



async function fetchNearestJobs(
  location: { latitude: number; longitude: number },
  limit = 2,
  offset = 0
) {
  const supabase = createClient();

  if (location.latitude === undefined || location.longitude === undefined) {
    throw new Error("Location is required");
  }

  const { data, error } = await supabase.rpc("get_nearby_jobs", {
    user_lat: location.latitude,
    user_long: location.longitude,
    lim: limit,
    off: offset,
  });

  if (error) {
    throw new Error("Error fetching nearby jobs");
  }

  const jobsWithImages = await Promise.all(
    data.map(async (job: Job) => {
      const image_urls = await Promise.all(
        job.image_urls.map(async (filePath: string) => {
          const { data: fileData } = await supabase.storage
            .from("job_files")
            .getPublicUrl(filePath, {
              transform: {
                width: 500,
                height: 500,
              },
            });

          return fileData.publicUrl;
        })
      );

      return {
        ...job,
        image_urls: image_urls.filter(Boolean),
      };
    })
  );

  return jobsWithImages;
}

export { fetchNearestJobs };

async function fetchQueryData(query: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("search_jobs", { query });

  if (error) {
    return null;
  }

  return data;
}

export { fetchQueryData };

async function searchNearbyJobs(
  query: string,
  latitude: number,
  longitude: number,
  page = 1,
  perPage = 10
): Promise<{ jobs: Job[]; totalCount: number }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("search_nearby_jobs", {
    query: query,
    user_lat: latitude,
    user_long: longitude,
    page: page,
    per_page: perPage,
  });


  if (error) {
    throw new Error("Error fetching nearby jobs");
  }

  const jobsWithImages = await Promise.all(
    data.map(async (job: Job) => {
      const image_urls = await Promise.all(
        job.image_urls.map(async (filePath: string) => {
          const { data: fileData } = await supabase.storage
            .from("job_files")
            .getPublicUrl(filePath, {
              transform: {
                width: 500,
                height: 500,
              },
            });

          return fileData.publicUrl;
        })
      );

      return { ...job, image_urls: image_urls.filter(Boolean) };
    })
  );

  const totalCount = data.length > 0 ? data[0].total_count : 0;

  return { jobs: jobsWithImages, totalCount: totalCount };
}

export { searchNearbyJobs };

async function fetchUserJobs() {
  const supabase = createClient();
  const userId = await getUserId();

  const { data: jobsData, error: jobsError } = await supabase
    .from("jobs")
    .select(
      `*, job_files(file_path, file_type), quotes(*, quote_files(file_path))`
    )
    .eq("user_id", userId);

  if (jobsError) {
    throw new Error("Error fetching user jobs");
  }

  const jobsWithImagesAndQuotes = await Promise.all(
    jobsData.map(async (job) => {
      const image_urls = await Promise.all(
        job.job_files.map(async (file: FileInfo) => {
          const { data: fileData } = await supabase.storage
            .from("job_files")
            .getPublicUrl(file.file_path, {
              transform: {
                width: 500,
                height: 500,
              },
            });

          return fileData.publicUrl;
        })
      );

      const quotesWithFiles = await Promise.all(
        job.quotes.map(async (quote: Quote) => {
          const quoteFileUrls = await Promise.all(
            quote.quote_files.map(async (file: FileInfo) => {
              const { data: fileData } = await supabase.storage
                .from("job_files")
                .getPublicUrl(file.file_path);

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
      const averageQuoteValue =
        quotesWithFiles.reduce((sum, quote) => sum + quote.value, 0) /
        quoteCount;

      return {
        ...job,
        image_urls: image_urls.filter(Boolean),
        quotes: quotesWithFiles,
        quote_count: quoteCount,
        average_quote_value: averageQuoteValue,
      };
    })
  );

  return jobsWithImagesAndQuotes;
}

export { fetchUserJobs };