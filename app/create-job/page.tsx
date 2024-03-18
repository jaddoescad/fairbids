import JobForm from './JobFormClient';

export default function Page() {
  return (
    <div className="max-w-4xl w-full mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Create New Job</h2>
      <JobForm />
    </div>
  );
}
