/* eslint-disable react/prop-types */

import {
  LucideMountainSnow,
  AudioWaveform,
  MapPinHouse,
  Building,
} from "lucide-react";

const ControlButton = ({
  isWaterBoundariesActive,
  isBuildingActive,
  isTerrainActive,
  isToolActive,
  handleToggleWaterBoundaries,
  handleToggleBuildings,
  handleToggleTerrain,
  handleToggleTool,
}) => {
  return (
    <div className="flex flex-col absolute top-5 right-[9px] gap-1 bg-white rounded-md">
      <button
        onClick={handleToggleTerrain}
        className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#3085c3] h-[29px] rounded-b-none rounded-t-md shadow-none items-center justify-center flex ${
          isTerrainActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
        }`}
      >
        <LucideMountainSnow />
      </button>
      <button
        onClick={handleToggleTool}
        className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#3085c3] h-[29px] rounded-none shadow-none items-center justify-center flex ${
          isToolActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
        }`}
      >
        <MapPinHouse />
      </button>
      <button
        onClick={handleToggleWaterBoundaries}
        className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#3085c3] h-[29px] rounded-none shadow-none items-center justify-center flex ${
          isWaterBoundariesActive
            ? "bg-[#1e3980] hover:bg-[#4060b7]"
            : "bg-white"
        }`}
      >
        <AudioWaveform />
      </button>
      <button
        onClick={handleToggleBuildings}
        className={`bg-white hover:bg-[#E6E6E6] w-[29px] text-[#3085c3] h-[29px] rounded-t-none rounded-b-md shadow-none items-center justify-center flex ${
          isBuildingActive ? "bg-[#1e3980] hover:bg-[#4060b7]" : "bg-white"
        }`}
      >
        <Building />
      </button>
    </div>
  );
};

export default ControlButton;
