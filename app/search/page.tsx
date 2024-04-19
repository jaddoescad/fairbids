'use client';

import React, { useEffect, useState, useContext } from "react";
import { searchNearbyJobs } from "@/services/fetchJobData";
import JobList from "@/components/JobList";
import { LocationContext } from "@/context/LocationContext";
import { Box, Center, Heading, useToast } from "@chakra-ui/react";
import Pagination from "@/components/Pagination";
import { Job, SearchParams } from "@/types/types";


export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { query } = searchParams;
  const { location } = useContext(LocationContext);
  const [searchResults, setSearchResults] = useState<Job[]>([]); // Specify the type of searchResults as Job[]
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 3;
  const toast = useToast();

  useEffect(() => {
    async function fetchData() {
      if (location && location.latitude && location.longitude) {
        try {
        const { jobs, totalCount } = await searchNearbyJobs(
          query,
          location.latitude,
          location.longitude,
          currentPage,
          perPage
        );
        setSearchResults(jobs || []); // Set an empty array if jobs is undefined
        setTotalPages(Math.ceil(totalCount / perPage));
        } catch (error) {
          toast({
            title: "Error",
            description: "Error fetching search results",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    }
    fetchData();
  }, [query, location, currentPage]);

  const handlePageChange = (page: number) => { // Specify the type of page as number
    setCurrentPage(page);
  };

  return (
    <Box maxW="2050px" mx="auto">
      <Box>
        <Heading as="h2" size="lg" mb={8} mt={2}>
          Search results for "{query}"
        </Heading>
        <JobList jobs={searchResults} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}