"use client";
import React, { useState, useEffect } from "react";
import { Select, Box, Text } from "@chakra-ui/react";
import { updateJobCategory } from '../../services/updateCategory';
import { useRouter } from "next/navigation";
import { TopTitle } from "./FormReusable/TopTitle";

const categoryOptions = {
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  'full-house-renovation': 'Full House Renovation',
  other: 'Other',
};

// CategorySelect.js
export function CategorySelect({ initialCategory, setCategory }) {
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
  }

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
    </Box>
  );
}