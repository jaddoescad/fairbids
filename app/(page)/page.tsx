'use client';
import React, { useContext, useEffect, useState } from "react";
import { fetchNearestJobs } from "@/services/fetchJobData";
import JobList from '@/components/JobList';
import { LocationContext } from "@/context/LocationContext";
import { Box, Button, Center, Heading, Spinner, useToast } from "@chakra-ui/react";

export default function Index() {
  const { location } = useContext(LocationContext);
  const [nearestJobs, setNearestJobs] = useState<any[]>([]); // Specify the type as any[] or a more specific type
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const limit = 2;
  const toast = useToast();

  useEffect(() => {
    async function fetchJobs() {
      if (location.latitude && location.longitude) {
        try {
          const jobs = await fetchNearestJobs(
            { latitude: location.latitude, longitude: location.longitude },
            limit,
            offset
          );
          setNearestJobs(offset === 0 ? jobs : (prevJobs) => [...prevJobs, ...jobs]);
          setHasMore(jobs.length === limit);
        } catch (error) {
          console.error("Error fetching nearest jobs:", error);
          toast({
            title: "Error",
            description: "Error fetching nearest jobs",
            status: "error",
            duration: 3000,
            isClosable: true,
          });          // Handle the error, e.g., show an error message to the user
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchJobs();
  }, [location.latitude, location.longitude]);
  
  const handleShowMore = async () => {
    if (location.latitude && location.longitude) {
      setIsLoadingMore(true);
      setOffset((prevOffset) => prevOffset + limit);
      try {
        const jobs = await fetchNearestJobs(
          { latitude: location.latitude, longitude: location.longitude },
          limit,
          offset + limit
        );
        setNearestJobs((prevJobs) => [...prevJobs, ...jobs]);
        setHasMore(jobs.length === limit);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error fetching nearest jobs",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        // Handle the error, e.g., show an error message to the user
      } finally {
        setIsLoadingMore(false);
      }
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
        </Box>
      )}
    </Box>
  );
}