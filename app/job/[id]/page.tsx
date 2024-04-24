"use server";

import { JobDetailsParams } from "@/types/types";
import JobDetailsContent from "./JobDetailsContent";
import { fetchJobData } from "@/services/fetchJobData";

export async function generateMetadata({ params }: { params: JobDetailsParams }) {
  const { id } = params;
  const job = await fetchJobData(id);

  const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const imageUrl = job.before_images?.[0]?.image_url || job.after_images?.[0]?.image_url;

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