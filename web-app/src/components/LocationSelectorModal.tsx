

import React, { useState, useEffect, useRef } from 'react';
import { popularCities, otherCities } from '../cityData';
import { CloseIcon, CrosshairIcon } from './icons';
import Button from './ui/Button';

declare const google: any;

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity?: (city: string) => void;
  selectedCity?: string;
  onConfirm?: (location: { lat: number; lng: number }) => void;
  currentLocation?: { lat: number; lng: number } | null;
}

const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  selectedCity,
  onConfirm,
  currentLocation,
}) => {
  if (!isOpen) return null;

  // RENDER MAP MODAL if onConfirm is passed
  if (onConfirm) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any | null>(null);
    const markerInstanceRef = useRef<any | null>(null);
    
    const [pinnedLocation, setPinnedLocation] = useState(currentLocation);
    const [geolocationError, setGeolocationError] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    // Reset internal state when modal is opened or location prop changes
    useEffect(() => {
        if (isOpen) {
            setPinnedLocation(currentLocation);
            setGeolocationError(null);
        }
    }, [isOpen, currentLocation]);

    // Initialize or update the map
    useEffect(() => {
        if (isOpen && mapRef.current && google) {
            const center = pinnedLocation || { lat: 28.6139, lng: 77.2090 };
            
            if (!mapInstanceRef.current) {
                const map = new google.maps.Map(mapRef.current, {
                    center,
                    zoom: 15,
                    disableDefaultUI: true,
                    zoomControl: true,
                });
                mapInstanceRef.current = map;

                const marker = new google.maps.Marker({
                    position: center,
                    map: map,
                    draggable: true,
                });
                markerInstanceRef.current = marker;

                map.addListener('click', (e: any) => {
                    const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                    marker.setPosition(newPos);
                    setPinnedLocation(newPos);
                    setGeolocationError(null);
                });
                
                marker.addListener('dragend', (e: any) => {
                    const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                    setPinnedLocation(newPos);
                    setGeolocationError(null);
                });
            } else {
                // Map already exists, just update center and marker
                mapInstanceRef.current.setCenter(center);
                markerInstanceRef.current?.setPosition(center);
            }
        }
    }, [isOpen, pinnedLocation]);

    const handleFindMyLocation = () => {
        setGeolocationError(null);
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    if (mapInstanceRef.current && markerInstanceRef.current) {
                        mapInstanceRef.current.setCenter(newPos);
                        mapInstanceRef.current.setZoom(17);
                        markerInstanceRef.current.setPosition(newPos);
                        setPinnedLocation(newPos);
                    }
                    setIsLocating(false);
                },
                (error) => {
                    let message = "Could not access your location.";
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            message = "You denied location access. Please enable it in your browser settings.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            message = "The request to get your location timed out.";
                            break;
                    }
                    setGeolocationError(message);
                    setIsLocating(false);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setGeolocationError("Geolocation is not supported by this browser.");
            setIsLocating(false);
        }
    };

    const handleConfirm = () => {
        if(pinnedLocation) {
            onConfirm(pinnedLocation);
        }
        onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4 animate-fade-in-up flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-200 flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Pin Your Location</h2>
              <p className="text-slate-500 mt-1">Click or drag the marker to set your address.</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={handleFindMyLocation} disabled={isLocating} className="flex items-center gap-2">
                    {isLocating ? (
                        <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <CrosshairIcon className="w-4 h-4" />
                    )}
                    <span>{isLocating ? 'Finding...' : 'Find Me'}</span>
                </Button>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
          </div>
          <div className="p-1 sm:p-2 md:p-6 flex-grow relative">
            <div ref={mapRef} style={{ height: '45vh', width: '100%' }} className="rounded-lg bg-slate-200 flex items-center justify-center text-slate-500">
               Loading Map...
            </div>
            {geolocationError && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-11/12 max-w-sm z-10 bg-red-100 text-red-800 p-3 rounded-lg text-sm text-center shadow-lg">
                  {geolocationError}
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50 rounded-b-2xl flex justify-end items-center gap-4">
            {pinnedLocation && <p className="text-xs text-slate-600 mr-auto">Lat: {pinnedLocation.lat.toFixed(4)}, Lng: {pinnedLocation.lng.toFixed(4)}</p>}
             <Button variant="secondary" onClick={onClose}>Cancel</Button>
             <Button onClick={handleConfirm} disabled={!pinnedLocation}>Confirm Location</Button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER CITY SELECTOR (original logic)
  const handleCitySelect = (city: string) => {
    if (onSelectCity) {
      onSelectCity(city);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl m-4 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Select Location</h2>
            <p className="text-slate-500 mt-1">Provide your location to server you better</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 p-2 -mr-2 -mt-2">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div>
            <h3 className="font-semibold text-slate-700 mb-4">Popular Cities</h3>
            <div className="grid grid-cols-4 gap-4">
              {popularCities.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => handleCitySelect(name)}
                  className={`flex flex-col items-center justify-center text-center p-3 rounded-lg border-2 transition-colors duration-200 h-28 ${
                    selectedCity === name
                      ? 'border-brand-secondary text-brand-secondary bg-emerald-50'
                      : 'border-slate-200 hover:border-brand-secondary hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-10 h-10 mb-2" />
                  <span className="text-sm font-medium leading-tight">{name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-700 mb-4">Other Cities</h3>
            <div className="grid grid-cols-3 gap-2">
              {otherCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${
                      selectedCity === city
                      ? 'bg-brand-secondary text-white border-brand-secondary'
                      : 'bg-white border-slate-300 text-slate-600 hover:border-brand-secondary hover:text-brand-secondary'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelectorModal;
