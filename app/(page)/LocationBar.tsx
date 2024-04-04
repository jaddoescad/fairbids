'use client'

import React, { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";

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


import { Select } from "chakra-react-select";
import { useGoogleMapsScript } from "@/hooks/useGoogleMapsScript";
export const LocationBar = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [locationValue, setLocationValue] = useState("New York, NY, USA");

  const { isLoaded, loadError } = useGoogleMapsScript();


  useEffect(() => {
    if (isLoaded) {
      handleLocationChange(locationValue);
    }
  }, [isLoaded, locationValue]);

  const handleLocationChange = async (inputValue) => {
    setLocationValue(inputValue);

    if (isLoaded && inputValue) {
      const service = new window.google.maps.places.AutocompleteService();
      const predictions = await service.getPlacePredictions({
        input: inputValue,
      });

      if (predictions && predictions.predictions.length > 0) {
        console.log("predictions", predictions);
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
    if (inputValue) {
      setLocationValue(inputValue);
      handleLocationChange(inputValue);
    }
  };

  return (
<Select
      placeholder="Location"
      value={{ label: locationValue, value: locationValue }}
      onInputChange={handleInputChange}
      onChange={handleLocationSelect}
    //   defaultInputValue
      options={suggestions}
      isClearable={false}
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          minWidth: "300px",
        }),
        control: (provided) => ({
          ...provided,
          cursor: 'text',
          '&:hover': {
            cursor: 'text',
          },
        }),
      }}
    />
  );
};