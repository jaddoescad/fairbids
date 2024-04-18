// CategorySelect.js
import React from "react";
import { Select, Box, Text } from "@chakra-ui/react";
import { TopTitle } from "./FormReusable/TopTitle";

const categoryOptions = {
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  'full-house-renovation': 'Full House Renovation',
  other: 'Other',
};

type CategorySelectProps = {
  initialCategory: string;
  setCategory: (category: string) => void;
  errorMessage?: string;
};

export function CategorySelect({ initialCategory, setCategory, errorMessage }: CategorySelectProps) {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
  };

  return (
    <Box>
      <TopTitle>Category</TopTitle>
      <Select
        value={initialCategory}
        onChange={handleCategoryChange}
        placeholder="Select a category"
        maxW={"500px"}
        size={"lg"}
      >
        {Object.entries(categoryOptions).map(([value, name]) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </Select>
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
    </Box>
  );
}