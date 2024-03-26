"use client";

import React, { useState } from 'react';
import { Input, Text, Button, Box } from '@chakra-ui/react';
import { updateJobTitle } from '../../services/updateTitle';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';


export function TitleInput({ initialTitle, jobId }) {
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClient();
  const router = useRouter();


  const handleTitleChange = async (e) => {

    const newTitle = e.target.value;
    setTitle(newTitle);
    console.log('newTitle', newTitle);

    try {
      await updateJobTitle(jobId, newTitle);
      router.refresh();
    } catch (error) {
      console.error('Error updating job title', error);
    }


  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Box display="flex" alignItems="center" gap="2">
      {isEditing ? (
        <Input
          value={title}
          onChange={handleTitleChange}
          onBlur={toggleEdit} // Optionally, you can switch back to label mode on blur
          placeholder="Kitchen remodel: Electrical, plumbing, and drywall"
          autoFocus // Focus on the input field when editing starts
        />
      ) : (
        <>
          <Text>{title || 'No title set'}</Text>
          <Button onClick={toggleEdit} size="sm">Edit</Button>
        </>
      )}
    </Box>
  );
}
