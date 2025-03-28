/* eslint-disable react/prop-types */

import { RefreshCcwDot, Focus } from "lucide-react";

const Sidebar = ({
  isDataLayerVisible,
  isFocusActive,
  isRotateActive,
  alatSemporData,
  handleFlyTo,
  handleRotateCamera,
}) => {
  return (
    <div
      className={`bg-white top-5 left-[9px] absolute w-60 h-1/2 rounded-md transition-transform duration-500 ease-in-out ${
        isDataLayerVisible ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
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
              <div className="gap-x-3 flex">
                <button
                  onClick={() => handleFlyTo(id, [longitude, latitude])}
                  className={`bg-transparent hover:bg-transparent text-[#333333] hover:text-[#4060b7] w-4 h-6 shadow-none justify-items-center ${
                    isFocusActive === id
                      ? "text-[#4060b7]"
                      : "bg-transparent hover:bg-transparent"
                  }`}
                >
                  <Focus />
                </button>
                <button
                  onClick={handleRotateCamera}
                  className={`bg-transparent hover:bg-transparent w-4 h-6 shadow-none justify-items-center ${
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
  );
};

export default Sidebar;
