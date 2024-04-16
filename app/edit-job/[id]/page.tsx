import { authGuard } from "@/services/authServer";
import JobDetailsContent from "./JobDetailsContent";


export default async function JobDetails({params}) {
  await authGuard();
  const { id } = params;

  return <JobDetailsContent jobId={id}/>;
}