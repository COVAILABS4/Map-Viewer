"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const [locationData, setLocationData] = useState(null);

  const { id } = useParams();

  //   console.log(id);

  useEffect(() => {
    if (id) {
      // Fetch the location data for the specific id
      fetch(`/api/getlocation?id=${id}`)
        .then((response) => response.json())
        .then((data) => setLocationData(data));
    }
  }, [id]);

  if (!locationData) return <div>Loading...</div>;

  const path = locationData.geoaxis.map((point) => [
    point.latitude,
    point.longitude,
  ]);

  const startPosition = locationData.geoaxis[0];
  const endPosition = locationData.geoaxis[locationData.geoaxis.length - 1];

  return (
    <div>
      <h1>{locationData.name}</h1>
      <MapContainer
        center={[startPosition.latitude, startPosition.longitude]}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={path} color="blue" />

        <Marker
          position={[startPosition.latitude, startPosition.longitude]}
          icon={
            new L.Icon({
              iconUrl:
                "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl:
                "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
              shadowSize: [41, 41],
            })
          }
          title={`Start: ${startPosition.timestamp}`}
        >
          <Popup>Start: {startPosition.timestamp}</Popup>
        </Marker>

        <Marker
          position={[endPosition.latitude, endPosition.longitude]}
          icon={
            new L.Icon({
              iconUrl:
                "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl:
                "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
              shadowSize: [41, 41],
            })
          }
          title={`End: ${endPosition.timestamp}`}
        >
          <Popup>End: {endPosition.timestamp}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapPage;
