"use client";

import { use, useEffect, useState } from "react";
import { uploadImage } from "../../services/uploadImage";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export const ImageUpload = ({ jobId, imageType, initialImages }) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(initialImages || []);
  const router = useRouter();

  useEffect(() => {
    console.log("initialImages", initialImages);
  }, [initialImages]);

  const handleUpload = async (event) => {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user.id;

    setUploading(true);

    const files = Array.from(event.target.files);

    const uploadPromises = files.map(async (file) => {
      const publicUrl = await uploadImage(
        supabase,
        file,
        userId,
        jobId,
        imageType
      );
      return publicUrl;
    });

    const uploadedImages = await Promise.all(uploadPromises);
    setImages((prevImages) => [...prevImages, ...uploadedImages]);

    setUploading(false);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      <div className="flex">
        {images.map((imageUrl) => (
          <img key={imageUrl} src={imageUrl} alt={`${imageType} picture`} />
        ))}
      </div>
    </div>
  );
};
