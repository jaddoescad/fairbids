"use server";

// pages/my-jobs.tsx
import { Box, Text, Heading, VStack, Button } from "@chakra-ui/react";
import { getUserId } from "@/services/getUser";
import { fetchUserJobs } from "@/services/myjobs";
import Link from "next/link";

export default async function MyJobs() {
  const userId = await getUserId();
  const jobs = await fetchUserJobs(userId);

  return (
    <Box marginTop={10} paddingBottom={"200px"}>
      <Box background={"white"} padding={10}>
        <Heading as="h1" size="xl" mb={8}>
          My Jobs
        </Heading>
        {jobs.length === 0 ? (
          <Text>You haven't created any jobs yet.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {jobs.map((job) => (
              <Box
                key={job.id}
                borderWidth={1}
                borderRadius="lg"
                p={4}
                boxShadow="md"
                bg="white"
              >
                <Heading as="h2" size="lg" mb={2}>
                  {job.title}
                </Heading>
                <Text mb={4}>{job.location}</Text>
                <Button
                  as={Link}
                  href={`/job/${job.id}`}
                  colorScheme="blue"
                  size="sm"
                >
                  View Details
                </Button>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
}