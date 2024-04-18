import { FormEvent } from "react";

export interface TitleInputProps {
    title: string;
    setTitle: (value: string) => void;
    error: boolean;
    onEnter: () => void;
  }

export  interface CategorySelectProps {
    category: string;
    setCategory: (value: string) => void;
    error: boolean;
    onEnter: () => void;
  }

  export interface LocationAutocompleteProps {
    isLoaded: boolean;
    error: boolean;
    locationValue: string;
    setLocationValue: (value: string) => void;
    setLatitude: (value: number | null) => void;
    setLongitude: (value: number | null) => void;
    isValidLocation: boolean;
    setIsValidLocation: (isValid: boolean) => void;
    onSubmit: (e: FormEvent) => void;
  }


  export interface JobDetailsParams {
    id: string;
  }

  export interface JobDetails {
    id: string;
    title: string;
    category: string;
    location: {
      address: string;
      latitude: number;
      longitude: number;
    };
    description: string;
    published: boolean;
  }
  
  export interface Job {
    id: string;
    title: string;
    category: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    job_files: any[];
    quotes: any[];
    image_urls: string[]; // Add this property
    company: string; // Add this property
    quote_count: number; // Add this property
    average_quote_value?: number; // Add this property
  }

  export interface ImageType {
    filePath: string;
    preview?: string;
    publicUrl?: string;
  }

  export interface Quote {
    id: string;
    // Add other properties if necessary
  }

  export interface Location {
    address: string;
    latitude: number;
    longitude: number;
  }
  

export  interface SearchParams {
    query: string;
  }
  

export interface SearchResult {
    jobs: Job[];
    totalCount: number;
  }
  
  export interface LocationContextType {
    location: {
      latitude: number | null;
      longitude: number | null;
      address: string;
    };
    setLocation: React.Dispatch<
      React.SetStateAction<{
        latitude: number | null;
        longitude: number | null;
        address: string;
      }>
    >;
  }

  export interface LocationProviderProps {
    children: React.ReactNode;
  }
  

  export interface Suggestion {
    value: string;
    label: string;
  }

  export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
  }
  

  export interface FileInfo {
    file_path: string;
    file_type?: string;
    file_url?: string;
  }

export interface Quote {
  id: string;
  title: string;
  value: number;
  quote_files: (File | FileInfo)[];
  markedForDelete?: boolean;
}

  export interface ImageUploadProps {
    imageType: string;
    initialImages: ImageType[];
    onImagesChange: (images: ImageType[]) => void;
    setImagesToDelete: (images: string[]) => void;
  }

  export interface AfterImagesProps {
    job: Job;
    onAfterImagesChange: (images: ImageType[]) => void;
    setImagesToDelete: (imagePaths: string[]) => void;
    errorMessage?: string;
  }
  

  export interface BeforeImagesProps {
    job: Job;
    onBeforeImagesChange: (images: ImageType[]) => void;
    setImagesToDelete: (imagePaths: string[]) => void;
  }