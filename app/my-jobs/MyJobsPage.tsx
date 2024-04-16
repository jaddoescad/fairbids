'use client';
import { Box, Center, Heading, Spinner, VStack } from "@chakra-ui/react";
import JobList from "@/components/JobList";
import React, { useContext, useEffect, useState } from "react";
import { LocationContext } from "@/context/LocationContext";
import { Job } from "@/types/types";


interface MyJobsPageProps {
  jobs: Job[]; // Specify the type of 'jobs' as an array of 'Job' objects
}

export default function MyJobsPage({ jobs }: MyJobsPageProps) {
  return (
    <Box maxW="2050px" mx="auto">
      <Box w="100%" h="100%" maxW={"2050px"} mt={10} paddingBottom={50}>
        <Box>
          <Heading as="h2" size="xl" mb={8} mt={2}>
            My Jobs
          </Heading>
          <JobList jobs={jobs} />
        </Box>
      </Box>
    </Box>
  );
}