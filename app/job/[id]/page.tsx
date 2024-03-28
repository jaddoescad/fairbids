"use server";

import { createClient } from "@/utils/supabase/client";
import { CategorySelect } from "@/components/CreateJobComponents/CategorySelect";
import { LocationAutocomplete } from "@/components/CreateJobComponents/LocationInput";
import { TitleInput } from "@/components/CreateJobComponents/TitleInput";
import {
  AfterImages,
  BeforeImages,
} from "@/components/CreateJobComponents/BeforeAfterImageUpload";
import { DescriptionInput } from "@/components/CreateJobComponents/Description";
import { Quotes } from "@/components/CreateJobComponents/Quotes";
import { Box, Text, Center} from "@chakra-ui/react";

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

  const jobFiles = await Promise.all(
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

      var file = {
        ...file,
        file_url: fileData.publicUrl,
      };

      return file;
    })
  );

  const { data: quotesData, error: quotesError } = await supabase
    .from("quotes")
    .select("*, quote_files(file_path)")
    .eq("job_id", id);

  if (quotesError) {
    console.error("Error fetching quotes data", quotesError);
  }

  const updatedQuotesData = await Promise.all(
    quotesData.map(async (quote) => {
      const updatedQuoteFiles = await Promise.all(
        quote.quote_files.map(async (file) => {
          const { data: fileData, error: fileError } = await supabase.storage
            .from("job_files")
            .getPublicUrl(file.file_path);

          if (fileError) {
            console.error("Error fetching quote file URL", fileError);
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
        quote_files: updatedQuoteFiles.filter((file) => file !== null),
      };
    })
  );

  return {
    ...data,
    job_files: jobFiles.filter((file) => file !== null),
    quotes: updatedQuotesData || [],
  };
}

export default async function JobDetails({ params }) {
  const job = await fetchJobData(params.id);

  if (!job) {
    return <div>Loading...</div>;
  }

  const beforeImages = job.job_files
    .filter((file) => file.file_type === "before")
    .map((file) => file.file_url);

  const afterImages = job.job_files
    .filter((file) => file.file_type === "after")
    .map((file) => file.file_url);

  return (
    <Box marginTop={10} paddingBottom={"200px"}>
      <Center>
        <Text fontSize="3xl" fontWeight="bold" color="black" marginBottom={5}>
          Post Your Job
        </Text>
      </Center>
      <Box background={"white"} padding={10}>
        <TitleInput initialTitle={job.title} jobId={job.id} />
        <CategorySelect initialCategory={job.category} jobId={job.id} />
        <LocationAutocomplete initialLocation={job.location} jobId={job.id} />
        <DescriptionInput initialDescription={job.description} jobId={job.id} />
      </Box>
      <Box background={"white"} padding={10} my={5}>
        <BeforeImages jobId={job.id} initialImages={beforeImages} />
        <AfterImages jobId={job.id} initialImages={afterImages} />
      </Box>
      <Box background={"white"} padding={10} my={5}>
        <Quotes jobId={job.id} initialQuotes={job.quotes} />
      </Box>
    </Box>
  );
}
