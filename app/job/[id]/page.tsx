"use server";

import JobDetailsContent from "./JobDetailsContent";


export default async function JobDetails({params}) {
  const { id } = params;

  return <JobDetailsContent jobId={id}/>;
}