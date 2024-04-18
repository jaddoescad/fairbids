'use client';
import React, { useContext, useEffect, useState } from "react";
import { fetchNearestJobs } from "@/services/fetchJobData";
import JobList from '@/components/JobList';
import { LocationContext } from "@/context/LocationContext";
import { Box, Button, Center, Heading, Spinner } from "@chakra-ui/react";

export default function Index() {
  const { location } = useContext(LocationContext);
  const [nearestJobs, setNearestJobs] = useState<any[]>([]); // Specify the type as any[] or a more specific type
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 2;

  useEffect(() => {
    async function fetchJobs() {
      if (location.latitude && location.longitude) {
        const jobs = await fetchNearestJobs(
          { latitude: location.latitude, longitude: location.longitude },
          limit,
          offset
        );
        setNearestJobs(offset === 0 ? jobs : (prevJobs) => [...prevJobs, ...jobs]);
        setIsLoading(false);
        setHasMore(jobs.length === limit);
      }
    }
    fetchJobs();
  }, [location.latitude, location.longitude]);
  
  const handleShowMore = async () => {
    if (location.latitude && location.longitude) {
      setIsLoadingMore(true);
      setOffset((prevOffset) => prevOffset + limit);
      const jobs = await fetchNearestJobs(
        { latitude: location.latitude, longitude: location.longitude },
        limit,
        offset + limit
      );
      setNearestJobs((prevJobs) => [...prevJobs, ...jobs]);
      setIsLoadingMore(false);
      setHasMore(jobs.length === limit);
    }
  };

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
            {hasMore && (
              <Box width="100%" textAlign="center" mt={4}>
                <Button onClick={handleShowMore} size={"lg"} colorScheme="blue" isLoading={isLoadingMore}>
                  Show More
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}