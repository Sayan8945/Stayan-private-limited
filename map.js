// const axios = require("axios");
// require("dotenv").config();
// const googleMapKey = process.env.MAP_API_KEY;


// let geocodeAddress = async (address) => {
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapKey}`;
//   try {
//     const response = await axios.get(url);
//     if (response.data.status === "OK") {
//       const location = response.data.results[0].geometry.location;
//       return location;
//     } else {
//       console.error("Geocoding error:", response.data.status);
//     }
//   } catch (err) {
//     console.error("Request failed:", err);
//   }
// }

module.exports = {googleMapKey, geocodeAddress};
