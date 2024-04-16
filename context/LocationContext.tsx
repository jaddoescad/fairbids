'use client';
import { LocationContextType, LocationProviderProps } from '@/types/types';
import React, { createContext, useState, useEffect } from 'react';


export const LocationContext = createContext<LocationContextType>({
  location: {
    latitude: null,
    longitude: null,
    address: '',
  },
  setLocation: () => {},
});


export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    address: string;
  }>({
    latitude: null,
    longitude: null,
    address: '',
  });

  const fetchDefaultLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        address: `${data.city}, ${data.region}, ${data.country_name}`,
      });
    } catch (error) {
      console.error('Error fetching default location:', error);
    }
  };

  useEffect(() => {
    fetchDefaultLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};