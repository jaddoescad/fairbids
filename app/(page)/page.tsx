'use client';

import React, { useContext, useEffect, useState } from "react";
import { fetchNearestJobs } from "@/services/fetchJobData";
import JobList from '@/components/JobList';
import { LocationContext } from "@/context/LocationContext";
import { Box, Center, Heading, Spinner } from "@chakra-ui/react";

export default function Index() {
  const { location } = useContext(LocationContext);
  const [nearestJobs, setNearestJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      if (location.latitude && location.longitude) {
        setIsLoading(true);
        const jobs = await fetchNearestJobs(location);
        setNearestJobs(jobs);
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, [location.latitude, location.longitude]);

  return (
    <Box maxW="2050px" mx="auto">
      {isLoading ? (
        <Center h="full">
        <Spinner size="xl" />
        </Center>
      ) : (
        <Box w="100%" h="100%" maxW={"2050px"} mt={10} paddingBottom={50}>
        <Box>
          <Heading as="h2" size="xl" mb={8} mt={2}>
            Nearest Jobs
          </Heading>
        <JobList jobs={nearestJobs} />
        </Box>
        </Box>
      )}
    </Box>
  );
}