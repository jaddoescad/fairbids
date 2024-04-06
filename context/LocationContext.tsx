'use client'

import React, { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext(
  {
    location: {
      latitude: null,
      longitude: null,
      address: "",
    },
    setLocation: () => {},
  }
);



export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: null,
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