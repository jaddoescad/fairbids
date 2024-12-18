"use server";

import { JobDetailsParams } from "@/types/types";
import JobDetailsContent from "./JobDetailsContent";
import { fetchJobData } from "@/services/fetchJobData";

export async function generateMetadata({ params }: { params: JobDetailsParams }) {
  const { id } = params;
  const job = await fetchJobData(id);
  const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL ? `https://${process.env.NEXT_PUBLIC_SITE_URL}` : 'http://localhost:3000';

  let imageUrl = null;
  if (job.job_files?.[0]?.file_url) {
    imageUrl = job.job_files[0].file_url;
  } else if (job.quotes?.[0]?.quote_files?.[0]?.file_url) {
    imageUrl = job.quotes[0].quote_files[0].file_url;
  }

  return {
    title: job.title,
    description: job.description,
    openGraph: {
      title: job.title,
      description: job.description,
      url: `${defaultUrl}/job/${id}`,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function JobDetails({ params }: { params: JobDetailsParams }) {
  const { id } = params;

  return <JobDetailsContent jobId={id}/>;
}