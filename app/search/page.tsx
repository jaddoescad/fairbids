'use client';
import React, { useEffect, useState, useContext } from "react";
import { searchNearbyJobs } from "@/services/fetchJobData";
import JobList from "@/components/JobList";
import { LocationContext } from "@/context/LocationContext";
import { Box, Center, Heading } from "@chakra-ui/react";
import Pagination from "@/components/Pagination";

export default function SearchPage({ searchParams }) {
  const { query } = searchParams;
  const { location } = useContext(LocationContext);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      if (location && location.latitude && location.longitude) {
        const data = await searchNearbyJobs(
          query,
          location.latitude,
          location.longitude,
          20
        );
        setSearchResults(data);
      }
    }
    fetchData();
  }, [query, location]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box maxW="2050px" mx="auto">
      <Box>
        <Heading as="h2" size="xl" mb={8} mt={2}>
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