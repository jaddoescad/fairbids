import { authGuard, getUserId } from "@/services/getUser";
import { fetchUserJobs } from "@/services/fetchJobData";
import MyJobsPage from "./MyJobsPage";

export default async function Page() {
  await authGuard();
  const userId = await getUserId();
  const jobs = await fetchUserJobs(userId);

  return <MyJobsPage jobs={jobs} />;
}