import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { getRealTimeData } from "../utils/api";
import formatterDate from "../utils/formatter/formatterDate";

const Dashboard = () => {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style:
        "https://api.maptiler.com/maps/openstreetmap/style.json?key=AW8IuG306IIk8kNdxEw6",
      center: [109.483303, -7.560628],
      zoom: 10,
      attributionControl: false,
    });

    map.on("style.load", async () => {
      try {
        const geojson = await getRealTimeData();

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
          console.log("tampilkan koordinat", coordinates);

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
                <p>Update:${formatterDate(properties.update_at)}</p>
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
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="w-full h-screen relative">
      <div className="w-full h-full relative" id="map" />
    </div>
  );
};

export default Dashboard;
