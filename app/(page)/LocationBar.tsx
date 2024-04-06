'use client'

import React, { useContext, useEffect, useState } from "react";
import { Input, Box } from "@chakra-ui/react";
// import { updateUserLocation } from "@/services/updateUserLocation";

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
import { LocationContext } from "@/context/LocationContext";

export const LocationBar = () => {
  const { isLoaded, loadError } = useGoogleMapsScript();
  const [suggestions, setSuggestions] = useState([]);
  const { setLocation, location } = useContext(LocationContext);

  const handleLocationChange = async (inputValue) => {
    if (isLoaded && inputValue) {
      const service = new window.google.maps.places.AutocompleteService();
      const predictions = await service.getPlacePredictions({ input: inputValue });
      if (predictions && predictions.predictions.length > 0) {
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

  const handleLocationSelect = async (selectedOption) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId: selectedOption.value }, async (results, status) => {
      if (status === "OK" && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        setLocation({
          latitude: lat(),
          longitude: lng(),
          address: selectedOption.label,
        });
      }
    });
  };

  const handleInputChange = (inputValue) => {
    if (inputValue) {
      setLocation({ ...location, address: inputValue });
      handleLocationChange(inputValue);
    }
  };

  return (
    <>
      <Box>{location?.address}</Box>
      <Box>{location?.latitude}</Box>
      <Box>{location?.longitude}</Box>
      <Box>{"yo"}</Box>
      <Select
        placeholder="Location"
        value={{ label: location?.address, value: location?.address }}
        onInputChange={handleInputChange}
        onChange={handleLocationSelect}
        options={suggestions}
        isClearable={false}
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            minWidth: "300px",
          }),
          control: (provided) => ({
            ...provided,
            cursor: "text",
            "&:hover": {
              cursor: "text",
            },
          }),
        }}
      />
    </>
  );
};