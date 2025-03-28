import { useEffect, useRef, useState } from "react";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";

import getRealTimeData from "../utils";
import PopupCard from "./PopupCard";
import ControlButton from "./ControlButton";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [isWaterBoundariesActive, setIsWaterBoundariesActive] = useState(false);
  const [isDataLayerVisible, setIsDataLayerVisible] = useState(false);
  const [isBuildingActive, setIsBuildingActive] = useState(false);
  const [isTerrainActive, setIsTerrainActive] = useState(true);
  const [isRotateActive, setIsRotateActive] = useState(false);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [alatSemporData, setAlatSemporData] = useState([]);
  const [isToolActive, setIsToolActive] = useState(false);

  const rotationRequestRef = useRef(null);
  const lastPopupCoordRef = useRef(null);
  const popupRef = useRef(null);
  const mapRef = useRef(null);

  const fetchData = async () => {
    try {
      const data = await getRealTimeData();

      if (mapRef.current && mapRef.current.getSource("alatSempor")) {
        mapRef.current.getSource("alatSempor").setData(data);
      }

      setAlatSemporData(data.features);
    } catch (error) {
      console.log("Upss, error fetch data:", error);
    }
  };

  const fetchSensorPopupData = async () => {
    if (!popupRef.current || !lastPopupCoordRef.current) return;

    try {
      const data = await getRealTimeData();

      const [clickedLng, clickedLat] = lastPopupCoordRef.current;
      const tolerance = 0.00001;

      const sameCoordinates = data.features.filter((f) => {
        const [lng, lat] = f.geometry.coordinates;
        return (
          Math.abs(lng - clickedLng) < tolerance &&
          Math.abs(lat - clickedLat) < tolerance
        );
      });

      const popupContent = PopupCard(sameCoordinates);

      popupRef.current.setHTML(
        `<div style="font-size: 12px; color: #333333; background-color: #d7e0e9; padding: 10px; border-radius: 8px; max-height: 300px; overflow-y: auto;">${popupContent}</div>`
      );
    } catch (error) {
      console.error("Gagal fetch popup data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorPopupData();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

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

    map.on("load", () => {
      const img = new Image();
      img.src = "/icon_workshop.png";
      img.onload = () => map.addImage("workshop-icon", img);

      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: true,
      });
      popupRef.current = popup;

      map.on("click", "alat-sempor-layer", (e) => {
        const clickedFeature = e.features?.[0];
        if (!clickedFeature) return;

        const [lng, lat] = clickedFeature.geometry.coordinates;
        lastPopupCoordRef.current = [lng, lat];

        fetchSensorPopupData();
        popup.setLngLat([lng, lat]).addTo(map);
      });

      map.on("mouseenter", "alat-sempor-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
    });

    mapRef.current = map;

    return () => map.remove();
  }, [isTerrainActive]);

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

  const handleToggleTerrain = () => setIsTerrainActive((prev) => !prev);

  const handleToggleTool = () => {
    setIsToolActive((prev) => !prev);
    setIsDataLayerVisible((prev) => !prev);
    if (mapRef.current) {
      mapRef.current.setLayoutProperty(
        "alat-sempor-layer",
        "visibility",
        !isToolActive ? "visible" : "none"
      );
    }
  };
  const handleToggleWaterBoundaries = () => {
    setIsWaterBoundariesActive((prev) => !prev);
    if (mapRef.current) {
      mapRef.current.setLayoutProperty(
        "batas-badan-air-sempor",
        "visibility",
        !isWaterBoundariesActive ? "visible" : "none"
      );
    }
  };
  const handleToggleBuildings = () => {
    setIsBuildingActive((prev) => !prev);
    if (mapRef.current) {
      mapRef.current.setLayoutProperty(
        "bangunan-3d",
        "visibility",
        !isBuildingActive ? "visible" : "none"
      );
    }
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

  const handleRotateCamera = () => {
    setIsRotateActive((prev) => !prev);
  };

  return (
    <div className="relative w-full h-screen">
      <div id="map" className="w-full h-full relative" />
      <ControlButton
        isTerrainActive={isTerrainActive}
        isToolActive={isToolActive}
        isWaterBoundariesActive={isWaterBoundariesActive}
        isBuildingActive={isBuildingActive}
        handleToggleTerrain={handleToggleTerrain}
        handleToggleTool={handleToggleTool}
        handleToggleWaterBoundaries={handleToggleWaterBoundaries}
        handleToggleBuildings={handleToggleBuildings}
      />
      <Sidebar
        isDataLayerVisible={isDataLayerVisible}
        alatSemporData={alatSemporData}
        isFocusActive={isFocusActive}
        isRotateActive={isRotateActive}
        handleFlyTo={handleFlyTo}
        handleRotateCamera={handleRotateCamera}
      />
    </div>
  );
};

export default Dashboard;
