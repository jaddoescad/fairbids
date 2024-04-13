"use client";

import { use, useEffect, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Input, Box, Text } from "@chakra-ui/react";
import { TopTitle } from "./FormReusable/TopTitle";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";

const libraries = ["places"];

export function LocationAutocomplete({ initialLocation, setLocation, errorMessage }) {
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputLocation, setInputLocation] = useState(initialLocation || "");
  const { isLoaded, loadError } = useGoogleMapsScript();


  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        const newLocation = place.formatted_address;
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        console.log("New location", newLocation);
        setLocation({
          address: newLocation,
          latitude,
          longitude,
        });
        setInputLocation(newLocation);

        console.log("Place", newLocation);
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  return (
    <>
      {isLoaded && (
        <Box py={4}>
          <TopTitle>Location</TopTitle>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Input
              value={inputLocation}
              onChange={(e) => {
                setInputLocation(e.target.value);
              }}
              placeholder="Enter location"
              p={5}
              size="lg"
              maxW={"500px"}
            />
          </Autocomplete>
          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        </Box>
      )}
    </>
  );
}
