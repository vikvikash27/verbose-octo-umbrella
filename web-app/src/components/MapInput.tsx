
import React, { useEffect, useRef, useState } from "react";
import { LoaderIcon } from "./icons";

// The google object is available globally from the script tag in index.html
declare const google: any;

interface MapInputProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    zip: string;
    lat: number;
    lng: number;
  }) => void;
}

const parseGoogleAddress = (
  geocodeResult: any
): { address: string; city: string; zip: string } => {
  if (!geocodeResult || !geocodeResult.address_components) {
    return { address: "", city: "", zip: "" };
  }

  const components = geocodeResult.address_components;
  const getComponent = (type: string) => components.find((c: any) => c.types.includes(type))?.long_name || "";

  const streetNumber = getComponent("street_number");
  const route = getComponent("route");

  let streetAddress = `${streetNumber} ${route}`.trim();
  if (!streetAddress) {
    // Fallback to the first part of formatted_address for places without a clear street
    streetAddress = (geocodeResult.formatted_address || "").split(",")[0];
  }

  const city = getComponent("locality") || getComponent("administrative_area_level_2") || "";
  const zip = getComponent("postal_code");

  return { address: streetAddress, city, zip };
};

export const MapInput: React.FC<MapInputProps> = ({ onLocationSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null);
  const autocompleteRef = useRef<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Initializing map...");

  useEffect(() => {
    let isMounted = true;
    const checkGoogleScript = () => {
      if (!isMounted) return;
      if (typeof google !== "undefined" && google.maps) {
        initMapAndServices();
      } else {
        setTimeout(checkGoogleScript, 100); // Poll until script is loaded
      }
    };

    const initMapAndServices = () => {
      if (!isMounted || !google) return;

      const geocoder = new google.maps.Geocoder();

      const reverseGeocode = (latlng: any) => {
        if (!isMounted) return;
        setIsLoading(true);
        setMessage("Fetching address...");
        geocoder.geocode({ location: { lat: latlng.lat(), lng: latlng.lng() } }, (results, status) => {
            if (!isMounted) return;
            if (status === "OK" && results && results[0]) {
              const locationDetails = parseGoogleAddress(results[0]);
              onLocationSelect({
                  ...locationDetails,
                  lat: latlng.lat(),
                  lng: latlng.lng(),
              });
              setMessage("Address updated. Drag pin or search to change.");
            } else {
              console.error("Geocoder failed due to: " + status);
              setMessage("Could not fetch address for this location.");
            }
            setIsLoading(false);
          }
        );
      };

      const createOrUpdateMarker = (position: any, shouldGeocode = true) => {
        if (!mapRef.current) return;
        if (!markerRef.current) {
          markerRef.current = new google.maps.Marker({
            position,
            map: mapRef.current,
            draggable: true,
            animation: google.maps.Animation.DROP,
          });
          markerRef.current.addListener("dragend", (e: any) => {
            reverseGeocode(e.latLng);
          });
        } else {
          markerRef.current.setPosition(position);
        }
        if (mapRef.current) {
            mapRef.current.panTo(position);
        }
        if (shouldGeocode) {
          reverseGeocode(position);
        }
      };

      const initializeMap = (center: { lat: number; lng: number }, zoom: number) => {
        if (mapContainerRef.current && !mapRef.current) {
          mapRef.current = new google.maps.Map(mapContainerRef.current, {
            center,
            zoom,
            disableDefaultUI: true,
            zoomControl: true,
          });

          mapRef.current.addListener("click", (e: any) =>
            createOrUpdateMarker(e.latLng)
          );

          if (searchInputRef.current) {
            autocompleteRef.current = new google.maps.places.Autocomplete(searchInputRef.current);
            autocompleteRef.current.bindTo("bounds", mapRef.current);
            autocompleteRef.current.setFields(["address_components", "geometry", "name", "formatted_address"]);

            autocompleteRef.current.addListener("place_changed", () => {
              const place = autocompleteRef.current?.getPlace();
              if (place?.geometry?.location) {
                createOrUpdateMarker(place.geometry.location, false); // Don't re-geocode
                const locationDetails = parseGoogleAddress(place);
                onLocationSelect({
                    ...locationDetails,
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
                setMessage("Address updated. Drag pin or search to change.");
                mapRef.current?.setZoom(17);
              }
            });
          }
        }
      };

      if (navigator.geolocation) {
        setMessage("Requesting your location...");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (!isMounted) return;
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            initializeMap(pos, 16);
            if(google) {
               createOrUpdateMarker(new google.maps.LatLng(pos.lat, pos.lng));
            }
          },
          () => {
            if (!isMounted) return;
            const indiaCenter = { lat: 20.5937, lng: 78.9629 };
            initializeMap(indiaCenter, 5);
            setIsLoading(false);
            setMessage("Location access denied. Search or click the map to set address.");
          }
        );
      } else {
        const indiaCenter = { lat: 20.5937, lng: 78.9629 };
        initializeMap(indiaCenter, 5);
        setIsLoading(false);
        setMessage("Geolocation not supported. Search or click the map.");
      }
    };

    checkGoogleScript();

    return () => {
      isMounted = false;
    };
  }, [onLocationSelect]);

  return (
    <div>
        <label htmlFor="address-search" className="block text-sm font-medium text-slate-700 mb-1">Search or Click Map to Set Address</label>
        <input
            id="address-search"
            ref={searchInputRef}
            type="text"
            placeholder="Search for your address..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary mb-2"
        />
        <div
            ref={mapContainerRef}
            style={{ height: "300px", width: "100%" }}
            className="rounded-lg border border-gray-300 bg-gray-100"
            aria-label="Interactive map for selecting address"
        />
        <p className="text-sm text-gray-600 mt-2 flex items-center h-5">
            {isLoading && <LoaderIcon className="w-4 h-4 mr-2" />}
            <span>{message}</span>
        </p>
    </div>
  );
};

export default MapInput;
