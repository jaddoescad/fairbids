import { Suspense } from "react";
import Signup from "./signup";
import { notAuthGuard } from "@/services/getUser";


export default async function SignUpPage() {
  await notAuthGuard();
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Signup />
      </Suspense>
    </div>
  );
}