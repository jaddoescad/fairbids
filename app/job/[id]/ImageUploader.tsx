'use client'
import React, { useState } from 'react';

interface ImageUploaderProps {
    onUpload: (files: File[]) => void;
    setThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>; // Add this line
  }
  

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, setThumbnails, setSelectedFiles }) => {

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const files = Array.from(e.target.files);
      
          // Create URLs for the new files
          const newThumbnails = files.map(file => URL.createObjectURL(file));
      
          // Update the thumbnails state by adding new thumbnails to existing ones
          setThumbnails(prevThumbnails => [...prevThumbnails, ...newThumbnails]);
          setSelectedFiles(prevFiles => [...prevFiles, ...files]);

          // Propagate upload event
          onUpload(files);
        }
      };
      
  
  return (
    <div>
        
      <label className="bg-yellow-500 rounded-full px-4 py-2 text-foreground mb-2">
        Upload Images
        <input type="file" multiple onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
};

export default ImageUploader;
