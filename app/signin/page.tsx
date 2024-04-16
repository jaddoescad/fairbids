import { Suspense } from "react";
import Signin from "./signin";
import { notAuthGuard } from "@/services/authServer";


export default async function SignUpPage() {
  await notAuthGuard();
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Signin />
      </Suspense>
    </div>
  );
}