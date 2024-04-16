import { Suspense } from "react";
import Signup from "./signup";
import { notAuthGuard } from "@/services/authServer";
import { Box } from "@chakra-ui/react";


export default async function SignUpPage() {
  await notAuthGuard();
  return (
    <Box mt={100}>
      <Suspense fallback={<div>Loading...</div>}>
        <Signup />
      </Suspense>
    </Box>
  );
}