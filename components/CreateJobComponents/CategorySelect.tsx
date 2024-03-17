"use client";

import React, { useState } from 'react';
import { Select, Text, Button, Box } from '@chakra-ui/react';
import { updateJobCategory } from '../../services/updateCategory';
import { createClient } from '@/utils/supabase/client';

const categoryOptions = {
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  'full-house-renovation': 'Full House Renovation',
  other: 'Other',
};

export function CategorySelect({ initialCategory, jobId }) {
  const [category, setCategory] = useState(initialCategory);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClient();

  const handleCategoryChange = async (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);

    try {
      await updateJobCategory(jobId, newCategory);
    } catch (error) {
      console.error('Error updating job title', error);
    }

    // onCategoryChange(newCategory); // Uncomment this if you need to propagate the change to a parent component
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Box display="flex" alignItems="center" gap="2">
      {isEditing ? (
        <Select
          value={category}
          onChange={handleCategoryChange}
          onBlur={toggleEdit} // Optionally, you can switch back to label mode on blur
          autoFocus // Focus on the select field when editing starts
        >
          {Object.entries(categoryOptions).map(([value, name]) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </Select>
      ) : (
        <>
          <Text>{categoryOptions[category] || 'No category set'}</Text>
          <Button onClick={toggleEdit} size="sm">
            Edit
          </Button>
        </>
      )}
    </Box>
  );
}