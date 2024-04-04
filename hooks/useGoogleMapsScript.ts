// useGoogleMapsScript.ts

import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

export const useGoogleMapsScript = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries,

  });

  return { isLoaded, loadError };
};