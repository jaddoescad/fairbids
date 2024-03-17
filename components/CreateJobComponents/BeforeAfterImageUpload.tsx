"use client";

import { useEffect } from "react";
import { ImageUpload } from "./ImageUpload";
import { createClient } from "@/utils/supabase/client";

export const BeforeImages = ({ jobId, initialImages }) => {

    useEffect(() => {
        console.log("initialImages", initialImages);

    }, [initialImages]);


    return (
      <div>
        <h3>Before Pictures</h3>
        <ImageUpload jobId={jobId} imageType="before" initialImages={initialImages} />
      </div>
    );
  };
  
  export const AfterImages = ({ jobId, initialImages }) => {
    return (
      <div>
        <h3>After Pictures</h3>
        <ImageUpload jobId={jobId} imageType="after" initialImages={initialImages} />
      </div>
    );
  };