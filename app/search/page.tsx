'use client';
import React, { useEffect, useState, useContext } from "react";
import { fetchNearbyQueryData } from "@/services/fetchJobData";
import JobList from '@/components/JobList';
import { LocationContext } from "@/context/LocationContext";

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
    <>
      <div style={{ maxWidth: "2050px", width: "100%" }}>
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          {searchResults && <JobList jobs={searchResults} />}
        </div>
      </div>
    </>
  );
}