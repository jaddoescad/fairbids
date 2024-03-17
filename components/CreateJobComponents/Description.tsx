'use client'

import { useState } from 'react';
import { updateJobDescription } from '../../services/updateDescription';

export function DescriptionInput({ initialDescription, jobId }) {
  const [description, setDescription] = useState(initialDescription || '');
  const [isEditing, setIsEditing] = useState(!initialDescription);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSave = () => {
    updateJobDescription(jobId, description);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter job description"
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p>{description}</p>
          <button onClick={handleEdit}>Edit</button>
        </>
      )}
    </div>
  );
}