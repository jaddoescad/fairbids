'use client';

import React, { useContext, useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { fetchNearestJobs } from "@/services/fetchJobData";
import JobList from '@/components/JobList';
import { LocationContext } from "@/context/LocationContext";
import { SearchBar, LocationBar } from "./LocationBar";
import PostButton from "@/components/PostQuoteButton";
import AuthButton from '../../components/AuthButton';

export default function Index() {
  const { location } = useContext(LocationContext);
  const [nearestJobs, setNearestJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      if (location && location.latitude && location.longitude) {
        const jobs = await fetchNearestJobs(location);
        setNearestJobs(jobs);
      }
    }
    fetchJobs();
  }, [location]);

  return (
    <>

      <div style={{ maxWidth: "2050px", width: "100%" }}>
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <JobList jobs={nearestJobs} />
        </div>
      </div>
    </>
  );
}


