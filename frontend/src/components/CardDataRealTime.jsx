import { useEffect, useState } from "react";
import { getRealTimeData } from "../utils/apis/api";

const CardDataRealTime = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRealTimeData();
        setData(response.features);
      } catch (error) {
        console.log("Opps, error fetching data", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="m-2 h-fit flex flex-col">
      <h1 className="bg-[#00ADB5] font-semibold text-xl mb-4 justify-center text-center py-3 rounded-md">
        Informasi Terkini
      </h1>
      {data.map((feature, index) => (
        <div
          key={index}
          className="bg-[#EEEEEE] p-2 mb-2 border border-[#3A4750] rounded-md"
        >
          <h3 className="font-semibold text-base border border-[#3A4750] rounded-md p-1 mb-2">
            {feature.properties.nama_alat}
          </h3>
          <p className="font-semibold text-sm">
            Elevasi:
            <span className="ml-1 font-normal text-sm">
              {feature.properties.elevasi}
            </span>
          </p>
          <p className="font-semibold text-sm">
            Volume:
            <span className="ml-1 font-normal text-sm">
              {feature.properties.volume}
            </span>
          </p>
          <p className="font-semibold text-sm">
            Trend:
            <span className="ml-1 font-normal text-sm">
              {feature.properties.trend}
            </span>
          </p>
          <p className="font-semibold text-sm">
            Status:
            <span className="ml-1 font-normal text-sm">
              {feature.properties.status}
            </span>
          </p>
          <p className="font-semibold text-sm">
            waktu:
            <span className="ml-1 font-normal text-sm">
              {new Date(feature.properties.update_at).toLocaleString()}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default CardDataRealTime;
