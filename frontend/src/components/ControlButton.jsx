/* eslint-disable react/prop-types */

import {
  LucideMountainSnow,
  AudioWaveform,
  MapPinHouse,
  Building,
  InfoIcon,
  Grid2X2Check,
} from "lucide-react";

import { useState } from "react";

const ControlButton = ({
  isWaterBoundariesActive,
  isBuildingActive,
  isTerrainActive,
  isToolActive,
  handleToggleWaterBoundaries,
  handleToggleBuildings,
  handleToggleTerrain,
  handleToggleTool,
  handleToggleInfo,
  handleResetView,
}) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const handleDropDownOpen = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col absolute top-5 right-[9px] gap-y-2 rounded-md">
      <button
        onClick={handleToggleInfo}
        className={`bg-white hover:bg-[#E6E6E6] text-[#3085c3] h-10 w-10 rounded-md shadow-none items-center justify-center flex ${
          isTerrainActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
        }`}
      >
        <InfoIcon />
      </button>
      <button
        onClick={() => {
          handleDropDownOpen();
          handleResetView();
        }}
        className={`bg-white hover:bg-[#E6E6E6] text-[#3085c3] h-10 w-10 rounded-md shadow-none items-center justify-center flex ${
          isTerrainActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
        }`}
      >
        <Grid2X2Check />
      </button>

      {isDropDownOpen && (
        <div className="flex flex-col absolute top-[92px] right-[4px] gap-y-1 rounded-md transition-all delay-300 duration-300 ease-in-out">
          <button
            onClick={handleToggleTerrain}
            className={`bg-white hover:bg-[#E6E6E6] text-[#3085c3] h-8 w-8 rounded-md shadow-none items-center justify-center flex ${
              isTerrainActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
            }`}
          >
            <LucideMountainSnow />
          </button>
          <button
            onClick={handleToggleTool}
            className={`bg-white hover:bg-[#E6E6E6] text-[#3085c3] h-8 w-8 rounded-md shadow-none items-center justify-center flex ${
              isToolActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
            }`}
          >
            <MapPinHouse />
          </button>
          <button
            onClick={handleToggleWaterBoundaries}
            className={`bg-white hover:bg-[#E6E6E6] text-[#3085c3] h-8 w-8 rounded-md shadow-none items-center justify-center flex ${
              isWaterBoundariesActive
                ? "bg-[#1e3980] hover:bg-[#4060b7]"
                : "bg-white"
            }`}
          >
            <AudioWaveform />
          </button>
          <button
            onClick={handleToggleBuildings}
            className={`bg-white hover:bg-[#E6E6E6] text-[#3085c3] h-8 w-8 rounded-md shadow-none items-center justify-center flex ${
              isBuildingActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
            }`}
          >
            <Building />
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlButton;
