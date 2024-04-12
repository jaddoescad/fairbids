'use client';

import { Box, Center, Heading, Spinner, VStack } from "@chakra-ui/react";
import { getUserId } from "@/services/getUser";
import { fetchUserJobs } from "@/services/fetchJobData";
import JobList from "@/components/JobList";
import React, { useContext, useEffect, useState } from "react";
import { LocationContext } from "@/context/LocationContext";


export default function Index() {
  const { location } = useContext(LocationContext);
  const [myJobs, setMyJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      if (location.latitude && location.longitude) {
        setIsLoading(true);
        const userId = await getUserId();
        const jobs = await fetchUserJobs(userId);
        setMyJobs(jobs);
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
            My Jobs
          </Heading>
        <JobList jobs={myJobs} />
        </Box>
        </Box>
      )}
    </Box>
  );
}