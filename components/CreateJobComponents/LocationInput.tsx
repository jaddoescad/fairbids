"use client";
import { useEffect, useState } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { Input, Box, Text } from "@chakra-ui/react";
import { updateJobLocation } from "../../services/updateLocation";
import { useRouter } from "next/navigation";
import { TopTitle } from "./FormReusable/TopTitle";

const libraries = ["places"];

export function LocationAutocomplete({ initialLocation, jobId }) {
  const [location, setLocation] = useState(initialLocation);
  const [autocomplete, setAutocomplete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log("initialLocation", initialLocation);
  }, [initialLocation]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = (autocompleteInstance) => {
    console.log("Autocomplete loaded:", autocompleteInstance);
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    console.log("Place changed");
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        const newLocation = place.formatted_address;
        setLocation(newLocation);
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      try {
        await updateJobLocation(jobId, location);
        router.refresh();
      } catch (error) {
        console.error("Error updating job location", error);
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [location, jobId, router]);

  return (
    <>
      {isLoaded && (
        <Box py={4}>
          <TopTitle>
            Location
          </TopTitle>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Input
              value={location}
              placeholder="Enter location"
              onChange={(e) => setLocation(e.target.value)}
              p={5}
              size="lg"
              maxW={"500px"}
            />
          </Autocomplete>
        </Box>
      )}
    </>
  );
}