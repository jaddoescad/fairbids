'use client'

import React, { useState } from "react";
import { Input } from "@chakra-ui/react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Input
      placeholder="Search Projects..."
      value={searchQuery}
      onChange={handleSearchChange}
    />
  );
};

const libraries = ["places"];

import { Select } from "chakra-react-select";
export const LocationBar = () => {
  const [locationValue, setLocationValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleLocationChange = async (inputValue) => {
    setLocationValue(inputValue);

    if (isLoaded && inputValue) {
      const service = new window.google.maps.places.AutocompleteService();
      const predictions = await service.getPlacePredictions({
        input: inputValue,
      });

      if (predictions && predictions.predictions.length > 0) {
        console.log(predictions);
        setSuggestions(
          predictions.predictions.map((prediction) => ({
            value: prediction.place_id,
            label: prediction.description,
          }))
        );
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleLocationSelect = (selectedOption) => {
    setLocationValue(selectedOption.label);
  };

  const handleInputChange = (inputValue) => {
    setLocationValue(inputValue);
    handleLocationChange(inputValue);
  };

  return (
    <Select
      placeholder="Location"
      value={{ label: locationValue, value: locationValue }}
      onInputChange={handleInputChange}
      onChange={handleLocationSelect}
      options={suggestions}
      isClearable
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          minWidth: "300px", // Adjust the value as needed
        }),
        control: (provided) => ({
          ...provided,
          cursor: 'text', // Changes cursor to text input type on hover
          '&:hover': {
            cursor: 'text', // Ensure the cursor remains text type even on hover
          },
        }),
      }}
    />
  );
};