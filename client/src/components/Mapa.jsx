import React, { useMemo } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import customGeoJson from "../assets/custom.geo.json"; // Asegúrate que incluye todos los países de Centroamérica

const CountryMap = ({ countryName }) => {
  const geoJsonStyle = (feature) => {
    const isSelected =
      feature.properties?.name?.toLowerCase() === countryName.toLowerCase() ||
      feature.properties?.NAME?.toLowerCase() === countryName.toLowerCase();

    return {
      fillColor: isSelected ? "lightgreen" : "lightblue", // Azul para seleccionado, gris para otros
      color: isSelected ? "black" : "lightblue",     // Bordes más oscuros para seleccionado
      weight: isSelected ? 1 : 1,
      fillOpacity: isSelected ? 1 : 1,
      opacity: 1,
      width: "100%",
      height: "100%"
    };
  };

  const centerOfCentralAmerica = useMemo(() => [14.5, -85], []);

  return (
    <MapContainer
      center={centerOfCentralAmerica}
      zoom={4.2}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      attributionControl={false}
      style={{
        backgroundColor: "transparent",
        width: '100%',
        height: '100%',
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      <GeoJSON data={customGeoJson} style={geoJsonStyle} />
    </MapContainer>
  );
};

export default CountryMap;
