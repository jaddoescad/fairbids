import { Suspense } from "react";
import Signin from "./signin";
import { notAuthGuard } from "@/services/authServer";
import { Box } from "@chakra-ui/react";


export default async function SignUpPage() {
  await notAuthGuard();
  return (
    <Box mt={100}>
      <Suspense fallback={<div>Loading...</div>}>
        <Signin />
      </Suspense>
    </Box>
  );
}