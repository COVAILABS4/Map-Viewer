"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Dynamically import Leaflet and react-leaflet components to disable SSR
import dynamic from "next/dynamic";

// Dynamically import Leaflet MapContainer and related components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// import L from "leaflet";
// const L = dynamic(() => import("leaflet"), { ssr: false });
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const [locationData, setLocationData] = useState(null);

  const [L, setL] = useState(null);
  //   const router = useRouter();
  const { id } = useParams(); // Get the location ID from the URL query

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });

    const userId = sessionStorage.getItem("userId");

    if (id && userId) {
      // Fetch the location data for the specific ID
      fetch(`/api/location/${id}?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => setLocationData(data.location));
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
