// services/jobService.js
import { FileInfo, Job, Quote } from "@/types/types";
import { createClient } from "@/utils/supabase/client";
import { getUserId } from "./authServer";
import { SupabaseClient } from "@supabase/supabase-js";

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
      const fileUrl = await getPublicUrl(supabase, file.file_path, 200, 200);

      return {
        ...file,
        file_url: fileUrl,
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
              const fileUrl = await getPublicUrl(supabase, file.file_path);

              return {
                ...file,
                file_url: fileUrl,
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
  limit = 10,
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
          return await getPublicUrl(supabase, filePath, 500, 500);
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


async function searchNearbyJobs(
  query: string,
  latitude: number,
  longitude: number,
  page = 1,
  perPage = 10
): Promise<{ jobs: Job[]; totalCount: number }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("search_jobs_rank", {
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
        job.job_files.map(async (file: FileInfo | File) => {
          if ("file_path" in file) {
            return await getPublicUrl(supabase, file.file_path, 500, 500);
          }
          return "";
        })
      );

      const quotesWithFiles = await Promise.all(
        job.quotes.map(async (quote: Quote) => {
          const quoteFileUrls = await Promise.all(
            quote.quote_files.map(async (file: FileInfo | File) => {
              if ("file_path" in file) {
                return await getPublicUrl(supabase, file.file_path);
              }
              return "";
            })
          );

          return {
            ...quote,
            quote_files: quoteFileUrls.filter(Boolean),
          };
        })
      );

      const quoteCount = quotesWithFiles.length;
      const averageQuoteValue = Math.round(
        quotesWithFiles.reduce((sum, quote) => sum + quote.value, 0) / quoteCount
      );

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

async function fetchJobImages(jobFiles: FileInfo[], fileType: string) {
  const supabase = createClient();

  const imagesData = await Promise.allSettled(
    jobFiles
      .filter((file: FileInfo) => file.file_type === fileType)
      .map(async (file: FileInfo) => {
        const originalUrl = await getPublicUrl(
          supabase,
          file.file_path,
          1000,
          1000
        );
        const thumbnailUrl = await getPublicUrl(
          supabase,
          file.file_path,
          200,
          200
        );

        return {
          original: originalUrl,
          thumbnail: thumbnailUrl,
        };
      })
  );

  return imagesData
    .map((result) => {
      if (result.status === "fulfilled") {
        return (
          result as PromiseFulfilledResult<{
            original: string;
            thumbnail: string;
          }>
        ).value;
      }
      return null;
    })
    .filter(
      (image): image is { original: string; thumbnail: string } =>
        image !== null
    );
}

export { fetchJobImages };

async function getPublicUrl(
  supabase: SupabaseClient,
  filePath: string,
  width = 500,
  height = 500
) {
  const { data: fileData } = await supabase.storage
    .from("job_files")
    .getPublicUrl(filePath, {
      transform: {
        width: width,
        height: height,
      },
    });

  return fileData.publicUrl;
}