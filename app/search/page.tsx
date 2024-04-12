'use client';
import React, { useEffect, useState, useContext } from "react";
import { fetchNearbyQueryData } from "@/services/fetchJobData";
import JobList from '@/components/JobList';
import { LocationContext } from "@/context/LocationContext";
import { Box, Center, Heading } from "@chakra-ui/react";

export default function SearchPage({ searchParams }) {
  const { query } = searchParams;
  const { location } = useContext(LocationContext);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (location && location.latitude && location.longitude) {
        const data = await fetchNearbyQueryData(query, location.latitude, location.longitude, 20);
        setSearchResults(data);
      }
    }
    fetchData();
  }, [query, location]);

  return (
    <Box maxW="2050px" mx="auto">

      <Box>
        <Heading as="h2" size="xl" mb={8} mt={2}>
          Search Results
        </Heading>
        <JobList jobs={searchResults} />
      </Box>
    </Box>
  );
}