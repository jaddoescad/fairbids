import { authGuard } from "@/services/authServer";
import { fetchUserJobs } from "@/services/fetchJobData";
import MyJobsPage from "./MyJobsPage";

export default async function Page() {
  await authGuard();
  const jobs = await fetchUserJobs();

  return <MyJobsPage jobs={jobs} />;
}