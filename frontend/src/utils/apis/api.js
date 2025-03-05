import axios from "axios";

export const getRealTimeData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/geoserver/demo_simadu/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=demo_simadu%3Alokasi_alat&maxFeatures=50&outputFormat=application%2Fjson"
    );
    return response.data;
  } catch (error) {
    throw Error(error);
  }
};
