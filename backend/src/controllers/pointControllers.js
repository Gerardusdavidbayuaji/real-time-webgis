// const {
//   getAllPointById,
//   updatePointById,
//   getAllPoints,
// } = require("../models/pointModel");

// // const generateRandomValue = () => {
// //   return parseFloat((Math.random() * 100).toFixed(2));
// // };

// const fetchAllPoints = async (req, res) => {
//   try {
//     const points = await getAllPoints();
//     res.status(200).json(points);
//   } catch (error) {
//     console.error("Oops, error fetching data:", error.message);
//     res.status(500).send("Internal server error");
//   }
// };

// const updateAllPoints = async () => {
//   try {
//     const pointById = await getAllPointById();

//     for (const point of pointById) {
//       const randomValue = generateRandomValue();
//       await updatePointById(point.id, { value: randomValue });
//     }
//     console.log("Update values successfuly!");
//   } catch (error) {
//     console.error("Oops, error updating values", error.message);
//   }
// };

// const scheduleUpdateAllPoints = () => {
//   setInterval(() => {
//     updateAllPoints();
//   }, 5000);
// };

// module.exports = {
//   fetchAllPoints,
//   scheduleUpdateAllPoints,
// };
