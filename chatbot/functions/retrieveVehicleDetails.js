const fetch = require("node-fetch");

module.exports = async function retrieveVehicleDetails(
  vehicleRegistrationMark
) {
  let url = `${process.env.VEHICLE_API_ENDPOINT}&auth_apikey=${
    process.env.VEHICLE_API_KEY
  }&user_tag=&key_VRM=${vehicleRegistrationMark}`;

  let vehicleDetails = await fetch(url)
    .then(res => res.json())
    .then(json => json.Response.DataItems.VehicleRegistration)
    .catch(err =>
      console.log("There was an error retrieving vehicle data", err)
    );
  return vehicleDetails;
};
