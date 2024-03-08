import { createClient } from "@/utils/supabase/client";

async function fetchJobData(id) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching job data", error);
    return null;
  }

  return data;
}

export default async function JobDetails({ params }) {
  const job = await fetchJobData(params.id);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{job.title}</h1>
      <p>Category: {job.category}</p>
      <p>Location: {job.location}</p>
    </div>
  );
}