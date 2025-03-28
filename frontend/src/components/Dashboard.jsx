import React, { useEffect, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

import {
  LucideMountainSnow,
  AudioWaveform,
  RefreshCcwDot,
  MapPinHouse,
  Building,
  Focus,
} from "lucide-react";

const Dashboard = () => {
  const [isWaterBoundariesActive, setIsWaterBoundariesActive] = useState(false);
  const [isDataLayerVisible, setIsDataLayerVisible] = useState(false);
  const [isBuildingActive, setIsBuildingActive] = useState(false);
  const [isPopupCoordinates, isSetPopupCoordinates] = useState(null);
  const [isTerrainActive, setIsTerrainActive] = useState(true);
  const [isRotateActive, setIsRotateActive] = useState(false);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [alatSemporData, setAlatSemporData] = useState([]);
  const [isToolActive, setIsToolActive] = useState(false);

  const rotationRequestRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      zoom: 14.2,
      center: [109.48839, -7.556628],
      pitch: 65,
      hash: true,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://api.maptiler.com/maps/satellite/{z}/{x}/{y}@2x.jpg?key=AW8IuG306IIk8kNdxEw6",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap Contributors",
            maxzoom: 19,
          },
          terrainSource: {
            type: "raster-dem",
            url: "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=AW8IuG306IIk8kNdxEw6",
            tileSize: 256,
          },
          alatSempor: {
            type: "geojson",
            data: "http://localhost:8080/geoserver/demo_serayu_opak/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demo_serayu_opak%3Alokasi_sensor_sempor&outputFormat=application%2Fjson",
          },
          batasWadukSempor: {
            type: "geojson",
            data: "http://103.176.97.201:8080/geoserver/serayu_sempor/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=serayu_sempor%3Abatas_waduk_sempor&outputFormat=application%2Fjson",
          },
          bangunanSempor: {
            type: "geojson",
            data: "http://103.176.97.201:8080/geoserver/serayu_sempor/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=serayu_sempor%3Abangunan_sempor&outputFormat=application%2Fjson",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
          {
            id: "batas-badan-air-sempor",
            type: "line",
            source: "batasWadukSempor",
            layout: {
              "line-join": "round",
              "line-cap": "round",
              visibility: "none",
            },
            paint: { "line-color": "#4ca5e9", "line-width": 0.5 },
          },
          {
            id: "alat-sempor-layer",
            type: "symbol",
            source: "alatSempor",
            layout: {
              "icon-image": "workshop-icon",
              "icon-size": 0.3,
              visibility: "none",
            },
          },
          {
            id: "bangunan-3d",
            type: "fill-extrusion",
            source: "bangunanSempor",
            layout: { visibility: "none" },
            paint: {
              "fill-extrusion-color": [
                "case",
                ["==", ["to-number", ["get", "high"]], 2],
                "#f7eaa8",
                ["==", ["to-number", ["get", "high"]], 4],
                "#d4dfa1",
                ["==", ["to-number", ["get", "high"]], 6],
                "#b1d59b",
                ["==", ["to-number", ["get", "high"]], 8],
                "#8eca94",
                ["==", ["to-number", ["get", "high"]], 10],
                "#6bbf8e",
                ["==", ["to-number", ["get", "high"]], 12],
                "#48b587",
                "#d6eadf",
              ],
              "fill-extrusion-height": ["to-number", ["get", "high"]],
              "fill-extrusion-base": 0,
            },
          },
        ],
        terrain: isTerrainActive
          ? { source: "terrainSource", exaggeration: 1 }
          : undefined,
        sky: isTerrainActive ? {} : undefined,
      },
      maxZoom: 18,
      maxPitch: 85,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      }),
      "bottom-right"
    );

    const loadImage = () => {
      const img = new Image();
      img.src = "/icon_workshop.png";
      img.onload = () => {
        map.addImage("workshop-icon", img);
      };
    };

    map.on("load", () => {
      loadImage();

      let popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: true,
      });

      map.on("click", "alat-sempor-layer", (e) => {
        const clickedFeature = e.features?.[0];
        if (!clickedFeature) return;

        const [clickedLng, clickedLat] = clickedFeature.geometry.coordinates;

        const tolerance = 0.00001;
        const sameCoordFeatures = alatSemporData.filter((f) => {
          const [lng, lat] = f.geometry.coordinates;
          return (
            Math.abs(lng - clickedLng) < tolerance &&
            Math.abs(lat - clickedLat) < tolerance
          );
        });

        const popupContent = sameCoordFeatures
          .map((f) => {
            const { fid, nama_sensor, nmfield, satuan, keterangan, value } =
              f.properties;

            return `
              <div style="margin-bottom: 8px;">
                <div><strong>${fid}-Sensor</strong> : ${nama_sensor}</div>
                <div><strong>Field</strong>        : ${nmfield}</div>
                <div><strong>Keterangan</strong>   : ${keterangan}</div>
                <div><strong>Nilai</strong>        : ${value} ${satuan}</div>
              </div>
            `;
          })
          .join('<hr style="margin: 6px 0; border-color: white;" />');

        popup
          .setLngLat([clickedLng, clickedLat])
          .setHTML(
            `<div style="font-size: 12px; color: #333333; background-color: #d7e0e9; padding: 10px; border-radius: 8px; max-height: 300px; overflow-y: auto;">${popupContent}</div>`
          )
          .addTo(map);
      });

      map.on("mouseenter", "alat-sempor-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [alatSemporData, isTerrainActive]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "http://localhost:8080/geoserver/demo_serayu_opak/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demo_serayu_opak%3Alokasi_sensor_sempor&outputFormat=application%2Fjson"
        );
        const data = await response.json();

        const filteredFeatures = (data.features || []).filter(
          (feature) => feature.id !== "lokasi_sensor_sempor.21"
          // (feature) => feature.fid !== "21"
        );

        const newData = {
          ...data,
          features: filteredFeatures,
        };

        if (mapRef.current && mapRef.current.getSource("alatSempor")) {
          mapRef.current.getSource("alatSempor").setData(newData);
        }

        setAlatSemporData(filteredFeatures);
      } catch (error) {
        console.log("Upss, error fetch data:", error);
      }
    }

    fetchData();
  }, []);

  const toggleLayerVisibility = (layerId, isActive) => {
    if (mapRef.current) {
      mapRef.current.setLayoutProperty(
        layerId,
        "visibility",
        isActive ? "visible" : "none"
      );
    }
  };

  const handleToggleTerrain = () => {
    setIsTerrainActive((prev) => !prev);
  };

  const handleToggleTool = () => {
    setIsToolActive((prev) => !prev);
    setIsDataLayerVisible((prev) => !prev);
    toggleLayerVisibility("alat-sempor-layer", !isToolActive);
  };

  const handleToggleWaterBoundaries = () => {
    setIsWaterBoundariesActive((prev) => !prev);
    toggleLayerVisibility("batas-badan-air-sempor", !isWaterBoundariesActive);
  };

  const handleToggleBuildings = () => {
    setIsBuildingActive((prev) => !prev);
    toggleLayerVisibility("bangunan-3d", !isBuildingActive);
  };

  const handleFlyTo = (no, coordinates) => {
    setIsFocusActive(no);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: coordinates,
        zoom: 18,
        speed: 0.5,
        pitch: 50,
        curve: 1.42,
        essential: true,
      });
    }
  };

  const toggleRotateCamera = () => {
    setIsRotateActive((prev) => !prev);
  };

  useEffect(() => {
    if (mapRef.current) {
      const rotateStep = () => {
        if (!isRotateActive) return;
        const newRotation = (mapRef.current.getBearing() + 1) % 360;
        mapRef.current.rotateTo(newRotation, { duration: 16 });
        rotationRequestRef.current = requestAnimationFrame(rotateStep);
      };

      if (isRotateActive) {
        rotationRequestRef.current = requestAnimationFrame(rotateStep);
      } else if (rotationRequestRef.current) {
        cancelAnimationFrame(rotationRequestRef.current);
      }

      return () => {
        if (rotationRequestRef.current) {
          cancelAnimationFrame(rotationRequestRef.current);
        }
      };
    }
  }, [isRotateActive]);

  return (
    <div className="relative w-full h-screen">
      <div id="map" className="w-full h-full relative" />

      <div className="flex flex-col absolute top-5 right-[9px]">
        <button
          onClick={handleToggleTerrain}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#3085c3] h-[29px] rounded-b-none rounded-t-md shadow-none ${
            isTerrainActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
          }`}
        >
          <LucideMountainSnow />
        </button>
        <button
          onClick={handleToggleTool}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#3085c3] h-[29px] rounded-none shadow-none ${
            isToolActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
          }`}
        >
          <MapPinHouse />
        </button>
        <button
          onClick={handleToggleWaterBoundaries}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#3085c3] h-[29px] rounded-none shadow-none ${
            isWaterBoundariesActive
              ? "bg-[#1e3980] hover:bg-[#4060b7]"
              : "bg-white"
          }`}
        >
          <AudioWaveform />
        </button>
        <button
          onClick={handleToggleBuildings}
          className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#3085c3] h-[29px] rounded-t-none rounded-b-md shadow-none ${
            isBuildingActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
          }`}
        >
          <Building />
        </button>
      </div>

      <div
        className={`bg-white top-5 left-[9px] absolute w-60 h-1/2 rounded-md transition-transform duration-500 ease-in-out ${
          isDataLayerVisible
            ? "translate-x-0"
            : "-translate-x-[calc(100%+1rem)]"
        }`}
      >
        <div className="flex bg-[#1e3980] text-white justify-center text-center p-3 rounded-t-md">
          <h3>Fly to Data</h3>
        </div>
        <div className="p-3 text-[#333333] space-y-3 overflow-y-auto max-h-[calc(100%-48px)]">
          {alatSemporData.map((item) => {
            const id = item.properties.fid;
            const { nama_sensor } = item.properties;
            const [longitude, latitude] = item.geometry.coordinates;
            return (
              <div
                key={id}
                className="flex justify-between items-center text-center border border-[#333333] rounded-md p-2"
              >
                <p className="text-sm">
                  {id}-<span>{nama_sensor}</span>
                </p>
                <div className="space-x-2">
                  <button
                    key={id}
                    onClick={() => handleFlyTo(id, [longitude, latitude])}
                    className={`bg-transparent hover:bg-transparent text-[#333333] hover:text-[#4060b7] w-4 h-6 shadow-none ${
                      isFocusActive === id
                        ? "text-[#4060b7]"
                        : "bg-transparent hover:bg-transparent"
                    }`}
                  >
                    <Focus />
                  </button>
                  <button
                    onClick={toggleRotateCamera}
                    className={`bg-transparent hover:bg-transparent w-4 h-6 shadow-none ${
                      isRotateActive === id
                        ? "text-[#4060b7]"
                        : "text-[#333333] hover:text-[#4060b7]"
                    }`}
                  >
                    <RefreshCcwDot />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
