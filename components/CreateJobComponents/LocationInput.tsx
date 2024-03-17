"use client";

import { useState, useRef, useCallback } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { Input, Text, Button, Box } from '@chakra-ui/react';
import { updateJobLocation } from '../../services/updateLocation';
import { createClient } from '@/utils/supabase/client';

const libraries = ['places'];

export function LocationAutocomplete({ initialLocation, jobId }) {
  const [location, setLocation] = useState(initialLocation);
  const [isEditing, setIsEditing] = useState(false);
  const autocompleteRef = useRef(null);
  const supabase = createClient();

  const handleLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const handlePlaceChanged = async () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      const newLocation = place.formatted_address;
      setLocation(newLocation);

      try {
        await updateJobLocation(jobId, newLocation);
      } catch (error) {
        console.error('Error updating job title', error);
      }

    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBHVjOOTOajAGnWUah3mbCq1NLkGNAZBTs"
      libraries={libraries}
    >
      <Box display="flex" alignItems="center" gap="2">
        {isEditing ? (
          <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
            <Input
              value={location}
              placeholder="Enter location"
              autoFocus // Focus on the input when editing
              onBlur={toggleEdit} // Switch back to label mode on blur
            />
          </Autocomplete>
        ) : (
          <>
            <Text>{location || 'No location set'}</Text>
            <Button onClick={toggleEdit} size="sm">Edit</Button>
          </>
        )}
      </Box>
    </LoadScript>
  );
}