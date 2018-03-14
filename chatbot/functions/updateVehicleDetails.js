// TODO would we need to update any other specific vehicle details?
module.exports = updateVehicleDetails = (oldVehicle, newVehicle) => {
  oldVehicle.vehicleMake = newVehicle.Make;
  oldVehicle.vehicleModel = newVehicle.Model;
  oldVehicle.registrationNumber = newVehicle.Vrm;
};
