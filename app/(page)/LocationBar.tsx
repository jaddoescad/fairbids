'use client'

import React, { useState } from "react";
import { Input } from "@chakra-ui/react";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { List, ListItem } from "@chakra-ui/react";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Input
      placeholder="Search..."
      value={searchQuery}
      onChange={handleSearchChange}
    />
  );
};





export const LocationBar = () => {
  const [locationValue, setLocationValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationValue(value);

    if (isLoaded) {
      const service = new window.google.maps.places.AutocompleteService();
      const predictions = await service.getPlacePredictions({ input: value });
      setSuggestions(predictions.predictions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocationValue(suggestion.description);
    setSuggestions([]);
  };

  return (
    <div>
      <Input
        placeholder="Location"
        value={locationValue}
        onChange={handleLocationChange}
      />
      {suggestions.length > 0 && (
        <List>
          {suggestions.map((suggestion) => (
            <ListItem
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              cursor="pointer"
            >
              {suggestion.description}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};