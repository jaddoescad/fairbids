'use client';

import React, { useContext, useEffect, useState } from "react";
import { fetchNearestJobs } from "@/services/fetchJobData";
import JobList from '@/components/JobList';
import { LocationContext } from "@/context/LocationContext";
import { Box, Button, Center, Heading, Spinner, useToast } from "@chakra-ui/react";
import { Job } from "@/types/types";

export default function Index() {
  const { location } = useContext(LocationContext);
  const [nearestJobs, setNearestJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 10;
  const toast = useToast();

  useEffect(() => {
    setNearestJobs([]); // Clear the nearestJobs state
    setOffset(0); // Reset the offset
    fetchJobs();
  }, [location.latitude, location.longitude]);

  const fetchJobs = async (newOffset = 0) => {
    if (location.latitude && location.longitude) {
      if (newOffset === 0) {
        setIsLoading(true);
      }
      try {
        const { jobsWithImages, hasMore } = await fetchNearestJobs(
          { latitude: location.latitude, longitude: location.longitude },
          limit,
          newOffset
        );
        setNearestJobs(newOffset === 0 ? jobsWithImages : (prevJobs) => [...prevJobs, ...jobsWithImages]);
        setHasMore(hasMore);
      } catch (error) {
        console.error("Error fetching nearest jobs:", error);
        toast({
          title: "Error",
          description: "Error fetching nearest jobs",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        if (newOffset === 0) {
          setIsLoading(false);
        }
      }
    }
  };

  const handleShowMore = async () => {
    setIsLoadingMore(true);
    const newOffset = offset + limit;
    setOffset(newOffset);
    await fetchJobs(newOffset);
    setIsLoadingMore(false);
  };

  return (
    <Box maxW="2050px" mx="auto">
      {isLoading ? (
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Box w="100%" h="100%" maxW={"2050px"} mt={10} paddingBottom={50}>
          <Heading as="h2" size="lg" mb={8} mt={2}>
            Nearest Jobs
          </Heading>
          <JobList jobs={nearestJobs} />
          {hasMore && (
            <Box width="100%" textAlign="center" mt={4}>
              <Button onClick={handleShowMore} size={"md"} colorScheme="blue" isLoading={isLoadingMore}>
                Show More
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}