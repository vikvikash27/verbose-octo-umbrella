
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  selectedCity: string;
  selectCity: (city: string) => void;
}

const LOCATION_STORAGE_KEY = 'easyorganic_city_web';
const DEFAULT_CITY = 'Hyderabad';

export const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>(DEFAULT_CITY);

  useEffect(() => {
    const loadCityFromStorage = () => {
      try {
        const storedCity = localStorage.getItem(LOCATION_STORAGE_KEY);
        if (storedCity !== null) {
          setSelectedCity(JSON.parse(storedCity));
        }
      } catch (error) {
        console.error("Failed to load city from localStorage", error);
      }
    };
    loadCityFromStorage();
  }, []);


  const selectCity = (city: string) => {
    setSelectedCity(city);
    try {
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(city));
    } catch (error) {
        console.error("Failed to save city to localStorage", error);
    }
  };

  const value = { selectedCity, selectCity };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
