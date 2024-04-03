"use client";
import { useEffect, useState } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { Input, Box, Text } from "@chakra-ui/react";
import { updateJobLocation } from "../../services/updateLocation";
import { useRouter } from "next/navigation";
import { TopTitle } from "./FormReusable/TopTitle";

const libraries = ["places"];



export function LocationAutocomplete({ initialLocation, setLocation, errorMessage }) {
  const [autocomplete, setAutocomplete] = useState(null);


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = (autocompleteInstance) => {
    console.log("Autocomplete loaded:", autocompleteInstance);
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        const newLocation = place.formatted_address;
        setLocation(newLocation);
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  }


  return (
    <>
      {isLoaded && (
        <Box py={4}>
          <TopTitle>
            Location
          </TopTitle>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Input
              value={initialLocation} onChange={(e) => setLocation(e.target.value)}
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


