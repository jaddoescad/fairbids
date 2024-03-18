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

async function fetchJobData(id) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, job_files(file_url, file_type)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching job data", error);
    return null;
  }

  const { data: quotesData, error: quotesError } = await supabase
    .from("quotes")
    .select("*, quote_files(file_url)")
    .eq("job_id", id);

  if (quotesError) {
    console.error("Error fetching quotes data", quotesError);
  }

  return {
    ...data,
    quotes: quotesData || [],
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
    <div>
      <TitleInput initialTitle={job.title} jobId={job.id} />
      <CategorySelect initialCategory={job.category} jobId={job.id} />
      <LocationAutocomplete initialLocation={job.location} jobId={job.id} />
      <DescriptionInput initialDescription={job.description} jobId={job.id} />
      <BeforeImages jobId={job.id} initialImages={beforeImages} />
      <AfterImages jobId={job.id} initialImages={afterImages} />
      <Quotes jobId={job.id} initialQuotes={job.quotes} />

    </div>
  );
}
