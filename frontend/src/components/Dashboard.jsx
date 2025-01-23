import { useEffect, useRef } from "react";

import formatterDate from "../utils/formatter/formatterDate";
import { getRealTimeData } from "../utils/apis/api";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

import Sidebar from "./Sidebar";

const Dashboard = () => {
  const mapContainerRef = useRef(null);
  // const popupRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style:
        "https://api.maptiler.com/maps/openstreetmap/style.json?key=AW8IuG306IIk8kNdxEw6",
      center: [109.457957, -7.627428],
      zoom: 11,
      attributionControl: false,
    });

    const fetchDataRealTime = async () => {
      try {
        const geojson = await getRealTimeData();
        if (map.getSource("lokasi_alat")) {
          map.getSource("lokasi_alat").setData(geojson);
        } else {
          map.addSource("lokasi_alat", {
            type: "geojson",
            data: geojson,
          });

          map.addLayer({
            id: "lokasi-alat-points",
            type: "circle",
            source: "lokasi_alat",
            paint: {
              "circle-radius": 6,
              "circle-color": "#FF5722",
            },
          });

          map.on("click", "lokasi-alat-points", (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const properties = e.features[0].properties;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new maplibregl.Popup({
              offset: [0, -25],
              closeButton: true,
              closeOnClick: true,
            })
              .setLngLat(coordinates)
              .setHTML(
                `
                <div style="font-family: Arial, sans-serif; font-size: 14px;">
                  <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${
                    properties.nama_alat
                  }</h3>
                  <p>Elevasi: ${properties.elevasi}</p>
                  <p>Volume: ${properties.volume}</p>
                  <p>Trend: ${properties.trend}</p>
                  <p>Status: ${properties.status}</p>
                 <p>Update: ${formatterDate(properties.update_at)}</p>
                </div>
              `
              )
              .addTo(map);
          });

          map.on("mouseenter", "lokasi-alat-points", () => {
            map.getCanvas().style.cursor = "pointer";
          });

          map.on("mouseleave", "lokasi-alat-points", () => {
            map.getCanvas().style.cursor = "";
          });
        }
      } catch (error) {
        console.error("Error fetching real-time data:", error);
      }
    };

    fetchDataRealTime();

    // const interval = setInterval(fetchDataRealTime, 5500);
    const interval = setInterval(() => {
      fetchDataRealTime();
    }, 5000);

    return () => {
      clearInterval(interval);
      map.remove();
    };
  }, []);

  return (
    <div className="w-full h-screen relative">
      <Sidebar />
      <div ref={mapContainerRef} id="map" className="w-full h-full relative" />
    </div>
  );
};

export default Dashboard;
