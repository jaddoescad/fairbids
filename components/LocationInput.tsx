import { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Input, Box, Text } from "@chakra-ui/react";
import { TopTitle } from "./CreateJobComponents/FormReusable/TopTitle";

export function GooglePlacesAutocomplete({
  initialLocation,
  onLocationChange,
  errorMessage,
}: {
  initialLocation: string;
  onLocationChange: (location: string) => void;
  errorMessage?: string;
}) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        onLocationChange(place.formatted_address);
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLocationChange(e.target.value);
  };

  return (
    <Box py={4}>
      <TopTitle>Location</TopTitle>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <Input
          value={initialLocation}
          onChange={handleInputChange}
          placeholder="Enter location"
          p={5}
          size="lg"
          maxW={"500px"}
        />
      </Autocomplete>
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
    </Box>
  );
}