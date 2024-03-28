"use client";
import React, { useState, useEffect } from "react";
import { Select, Box, Text } from "@chakra-ui/react";
import { updateJobCategory } from '../../services/updateCategory';
import { useRouter } from "next/navigation";

const categoryOptions = {
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  'full-house-renovation': 'Full House Renovation',
  other: 'Other',
};

export function CategorySelect({ initialCategory, jobId }) {
  const [category, setCategory] = useState(initialCategory);
  const router = useRouter();

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      try {
        await updateJobCategory(jobId, category);
        router.refresh();
      } catch (error) {
        console.error("Error updating job category", error);
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [category, jobId, router]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
  };

  return (
    <Box>
      <Text fontSize={"lg"} fontWeight="bold" mb={2}>
        Category
      </Text>
      <Select
        value={category}
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