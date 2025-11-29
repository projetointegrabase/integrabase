/**
 * SIMPLIFIED GOOGLE MAPS INTEGRATION - NO FORGE PROXY
 * Uses Google Maps API directly (free tier)
 */

import { useEffect, useRef } from "react";

interface MapViewProps {
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
  className?: string;
}

// Get API key from environment variable
// You need to get a free Google Maps API key from: https://console.cloud.google.com/
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

function loadMapScript() {
  if (typeof google !== "undefined" && google.maps) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkGoogle = setInterval(() => {
        if (typeof google !== "undefined" && google.maps) {
          clearInterval(checkGoogle);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
}

export function MapView({
  initialCenter = { lat: -23.5505, lng: -46.6333 }, // São Paulo default
  initialZoom = 12,
  onMapReady,
  className = "w-full h-96",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY");
      return;
    }

    loadMapScript()
      .then(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          mapId: "DEMO_MAP_ID", // Required for advanced markers
        });

        mapInstanceRef.current = map;
        onMapReady?.(map);
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
      });
  }, []);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={className + " flex items-center justify-center bg-gray-100 rounded-lg"}>
        <div className="text-center p-4">
          <p className="text-gray-600 mb-2">Google Maps não configurado</p>
          <p className="text-sm text-gray-500">
            Configure VITE_GOOGLE_MAPS_API_KEY para usar mapas
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}
