import axios from "axios";

export const getRealTimeData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/geoserver/demo_serayu_opak/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demo_serayu_opak%3Alokasi_sensor_sempor&outputFormat=application%2Fjson"
    );
    const data = await response.data;

    const filterFeatureById = (data.features || []).filter(
      (feature) => feature.id !== "lokasi_sensor_sempor.21"
    );

    return {
      ...data,
      features: filterFeatureById,
    };
  } catch (error) {
    throw Error("Upss, error fetching sensor data", error);
  }
};

export const getSemporLocation = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/geoserver/demo_serayu_opak/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demo_serayu_opak%3Alokasi_bendungan_sempor&outputFormat=application%2Fjson"
    );
    return response.data;
  } catch (error) {
    throw Error("Upss, error fetching sempor location", error);
  }
};
