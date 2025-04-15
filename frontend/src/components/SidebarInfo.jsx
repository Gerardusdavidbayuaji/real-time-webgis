/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { damInformation } from "../utils/mock";
import { useEffect } from "react";

const SidebarInfo = ({ isInfoLayerVisible }) => {
  const scrollContainer = useRef(null);
  const [currentTitle, setCurrentTitle] = useState(damInformation[0].title);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainer.current;
      if (!container) return;

      damInformation.forEach((info) => {
        const element = document.getElementById(`section-${info.id}`);

        if (element) {
          const rectangle = element.getBoundingClientRect();
          const containerTop = container.getBoundingClientRect().top;
          const containerHeight = container.offsetHeight;

          if (
            rectangle.top >= containerTop &&
            rectangle.top < containerTop + containerHeight / 2
          ) {
            setCurrentTitle(info.title);
          }
        }
      });
    };

    const container = scrollContainer.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      className={`bg-white top-5 left-[9px] absolute w-80 h-2/4 transition-transform duration-500 ease-in-out ${
        isInfoLayerVisible ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
      }`}
    >
      <div className="flex bg-[#1e3980] text-white justify-center text-center p-3">
        <h3>{currentTitle}</h3>
      </div>
      <div
        className="p-3 text-[#333333] space-y-3 overflow-y-auto max-h-[calc(100%-3rem)] rounded-b-md"
        ref={scrollContainer}
      >
        {damInformation.map((info) => (
          <div key={info.id} id={`section-${info.id}`}>
            <p className="text-sm font-normal">{info.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarInfo;
