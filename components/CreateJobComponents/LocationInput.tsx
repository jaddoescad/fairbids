"use client";
import { use, useEffect, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Input, Box, Text } from "@chakra-ui/react";
import { TopTitle } from "./FormReusable/TopTitle";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";
import { Location } from "@/types/types";

const libraries = ["places"];

interface LocationAutocompleteProps {
  initialLocation?: string;
  setLocation: (location: Location) => void;
  errorMessage?: string;
}

export function LocationAutocomplete({
  initialLocation,
  setLocation,
  errorMessage,
}: LocationAutocompleteProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [inputLocation, setInputLocation] = useState(initialLocation || "");
  const { isLoaded, loadError } = useGoogleMapsScript();

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address && place.geometry && place.geometry.location) {
        const newLocation = place.formatted_address;
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        setLocation({
          address: newLocation,
          latitude,
          longitude,
        });
        setInputLocation(newLocation);
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
                setLocation({} as Location);
              }}
              placeholder="Enter location"
              p={5}
              size="md"
              maxW={"500px"}
            />
          </Autocomplete>
          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        </Box>
      )}
    </>
  );
}