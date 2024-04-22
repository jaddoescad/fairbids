import { authGuard } from '@/services/authServer';
import JobForm from './JobFormClient';

export default async function Page() {
  await authGuard();
  return (
    <div className="max-w-4xl w-full mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Create New Job</h2>
      <JobForm />
    </div>
  );
}
