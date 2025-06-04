import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RecenterMap = ({ geojson }) => {
  const map = useMap();

  useEffect(() => {
    if (!geojson) return;

    let coords = [];

    if (geojson.type === "Polygon") {
      coords = geojson.coordinates[0];
    } else if (geojson.type === "MultiPolygon") {
      coords = geojson.coordinates.flat(2); // aplana multipolígonos
    }

    const latLngs = coords.map(([lng, lat]) => [lat, lng]);
    map.fitBounds(latLngs, { padding: [5, 5] }); // padding bajo = más zoom
  }, [geojson, map]);

  return null;
};


const CountrySilhouette = ({ geojson }) => {
  const style = {
    fillColor: "lightgrey",
    color: "lightgrey",
    weight: 0,
    fillOpacity: 1,
  };
  return <GeoJSON data={geojson} style={style} />;
};

const CountryMap = ({ countryName }) => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const cached = localStorage.getItem(`geojson-${countryName}`);
        if (cached) {
          const geojson = JSON.parse(cached);
          setGeoData(geojson);
          return;
        }

        const url = `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(
          countryName
        )}&polygon_geojson=1&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data || data.length === 0) throw new Error("No data from Nominatim");

        const geojson = data[0].geojson;
        localStorage.setItem(`geojson-${countryName}`, JSON.stringify(geojson));
        setGeoData(geojson);
      } catch (err) {
        console.error("Error fetching geojson:", err);
      }
    };

    if (countryName) fetchGeoJSON();
  }, [countryName]);

  if (!geoData) return <p className="text-xl">Cargando Mapa...</p>;

  return (
    <MapContainer
      center={[0,0]}
      zoom={5} // Este valor inicial ya no importa porque usamos fitBounds
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      attributionControl={false}
      style={{
        width: "230px",
        height: "130px",
        marginLeft: "10px",
        marginTop: "-15px",
        backgroundColor: "transparent",
      }}
    >
      <RecenterMap geojson={geoData}/>
      <CountrySilhouette geojson={geoData} />
    </MapContainer>
  );
};

export default CountryMap;
