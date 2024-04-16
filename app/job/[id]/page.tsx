"use server";

import { JobDetailsParams } from "@/types/types";
import JobDetailsContent from "./JobDetailsContent";


export default async function JobDetails({ params }: { params: JobDetailsParams }) {
  const { id } = params;

  return <JobDetailsContent jobId={id}/>;
}