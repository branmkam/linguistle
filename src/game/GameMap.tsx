import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  id: string;
  lat: number;
  lng: number;
  distance: number;
}

interface MapProps {
  points: Point[];
  targetPoint: [number, number]; // [lat, lng]
  darkMode?: boolean;
}

export default function GameMap({ points, darkMode }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Auto-zoom when points change
  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    // Create bounds from all points + target
    const allPoints = points;
    const bounds = L.latLngBounds(
      allPoints.map(p => [p.lat, p.lng] as [number, number])
    );

    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }, [points]);

  // Color based on distance
  const getColor = (distance: number, maxDistance: number) => {
    const ratio = distance / maxDistance;
    if (ratio === 0) return '#2233EE'; // Green - correct
    if (ratio < 0.25) return '#4CAF50'; // Green - close
    if (ratio < 0.5) return '#8BC34A'; // Light green
    if (ratio < 0.75) return '#FFC107'; // Amber
    return '#F44336'; // Red - far
  };

  const maxDistance = Math.max(...points.map(p => p.distance), 1);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={1}
      maxZoom={6}
      style={{ width: '100%', height: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/${darkMode ? 'dark_all' : 'light_all'}/{z}/{x}/{y}.png?key=cb1_3imr_1_45f02930defff05de59cf1d9`}
        attribution='&copy; CARTO, OpenStreetMap contributors'
      />

      {/* Data points with distance-based colors */}
      {points.map(point => (
        <Marker
          key={point.id}
          position={[point.lat, point.lng]}
          icon={L.icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <circle cx="12" cy="12" r="10" fill="${getColor(point.distance, maxDistance)}" />
              </svg>`
            )}`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })}
        >
          <Popup>{point.id}<br/>{point.distance.toFixed(2)}km away</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
