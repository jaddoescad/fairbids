'use client';
import { Box, Center, Heading, Spinner, VStack } from "@chakra-ui/react";
import JobList from "@/components/JobList";
import React, { useContext, useEffect, useState } from "react";
import { LocationContext } from "@/context/LocationContext";

export default function MyJobsPage({ jobs }) {
  const { location } = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setIsLoading(true);
      // Simulating loading delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
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
            <JobList jobs={jobs} />
          </Box>
        </Box>
      )}
    </Box>
  );
}