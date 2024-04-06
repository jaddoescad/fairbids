import Link from "next/link";

export default function JobList({ jobs }) {
  return (
    <div>
      <h2>Nearest Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
            <p>Distance: {job.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
