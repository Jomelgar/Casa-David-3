import React, { useMemo } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import customGeoJson from "../assets/custom.geo.json"; // Asegúrate que incluye todos los países de Centroamérica

const CountryMap = ({ countryName }) => {
  const geoJsonStyle = (feature) => {
    const featureName = feature.properties?.name || feature.properties?.NAME || "";
    const isSelected = featureName.toLowerCase() === countryName.toLowerCase();

    return {
      fillColor: isSelected ? "#66FF99" : "#9AD9B5",
      color: isSelected ? "green" : "##9AD9B5",
      weight: 1,
      fillOpacity: isSelected ? 1 : 0.8,
      opacity: 1,
    };
  };

  const centerOfCentralAmerica = useMemo(() => [14.5, -85], []);

  return (
    <div className="w-full h-full">
      <style>{`
        .leaflet-control-zoom {
          transform: scale(0.75);
          transform-origin: bottom right;
        }
        .leaflet-control-zoom a {
          width: 26px;
          height: 26px;
          line-height: 26px;
          font-size: 16px;
        }
      `}</style>
    <MapContainer
      center={centerOfCentralAmerica}
      zoom={4.2}
      zoomControl={true}
      dragging={true}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      attributionControl={false}
      style={{
        backgroundColor: "#3BBFD9",
        width: '100%',
        height: '100%',
        border: "3px solid #3BBFD9s",
      }}
    >
      <GeoJSON data={customGeoJson} style={geoJsonStyle} />
    </MapContainer>
    </div>
  );
};

export default CountryMap;
