"use client";

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Box, Select } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useRef, useCallback } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Input, Button } from "@chakra-ui/react";
import { saveJobToSupabase } from "@/services/createJobSupabase";

const libraries = ["places"];

export function JobFormClient({}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const category = searchParams.get("category");
  const [location, setLocation] = useState("");
  const autocompleteRef = useRef(null);

  const handleLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    setLocation(place.formatted_address);
    // You might want to do something with the place object here, like storing the coordinates
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const supabase = createClient();

    // Fetch user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error("User not logged in");
      return;
    }

    const userId = session.user.id;

    const savedJob = await saveJobToSupabase(
      supabase,
      title,
      category,
      location,
      userId
    );

    if (savedJob) {
      router.push(`/job/${savedJob.id}`);
    }
  };

  return (
    <div className="pt-4">
      <LoadScript
        googleMapsApiKey="AIzaSyBHVjOOTOajAGnWUah3mbCq1NLkGNAZBTs"
        libraries={libraries}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Box>Please type your city?</Box>
          <Autocomplete
            onLoad={handleLoad}
            onPlaceChanged={handlePlaceChanged}
            options={{
              types: ["(cities)"],
            }}
          >
            <Input placeholder="Type a city" />
          </Autocomplete>
          <Button type="submit" colorScheme="blue">
            Create Job
          </Button>
        </form>
      </LoadScript>
    </div>
  );
}
