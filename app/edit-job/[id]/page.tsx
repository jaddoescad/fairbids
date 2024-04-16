import { authGuard } from "@/services/authServer";
import JobDetailsContent from "./JobDetailsContent";
import { JobDetailsParams } from "@/types/types";



export default async function JobDetails({ params }: { params: JobDetailsParams }) {
  await authGuard();
  const { id } = params;

  return <JobDetailsContent jobId={id}/>;
}