"use client";
import { useEffect, useState } from "react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { Input, Text, Button, Box } from "@chakra-ui/react";
import { updateJobLocation } from "../../services/updateLocation";
import { createClient } from "@/utils/supabase/client";

const libraries = ["places"];

export function LocationAutocomplete({ initialLocation, jobId }) {
  const [location, setLocation] = useState(initialLocation);
  const [isEditing, setIsEditing] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("initialLocation", initialLocation);
  }
  , [initialLocation]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBHVjOOTOajAGnWUah3mbCq1NLkGNAZBTs",
    libraries,
  });

  const supabase = createClient();

  const onLoad = (autocompleteInstance) => {
    console.log("Autocomplete loaded:", autocompleteInstance);
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = async () => {
    console.log("Place changed");
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log("Place:", place);
      if (place && place.formatted_address) {
        const newLocation = place.formatted_address;
        setLocation(newLocation);
        try {
          await updateJobLocation(jobId, newLocation);
        } catch (error) {
          console.error("Error updating job location", error);
        }
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError(false); // Clear the error when toggling edit mode
  };

  return (
    <>
      {isLoaded && (
        <Box display="flex" alignItems="center" gap="2">
          {isEditing ? (
            <>
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <Input
                  value={location}
                  placeholder="Enter location"
                  autoFocus
                  onBlur={toggleEdit}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Autocomplete>
              {error && (
                <Box color="red" mt="2">
                  Please enter a location.
                </Box>
              )}
            </>
          ) : (
            <>
              <Text>{location || "No location set"}</Text>
              <Button onClick={toggleEdit} size="sm">
                Edit
              </Button>
            </>
          )}
        </Box>
      )}
    </>
  );
}