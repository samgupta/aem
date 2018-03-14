const retrieveVehicleDetails = require("../functions/retrieveVehicleDetails");
const updateVehicleDetails = require("../functions/updateVehicleDetails");

module.exports = supercharger =>
  new supercharger.Detail(
    // Supercharger Parameters
    [
      new supercharger.Parameter(
        "KEY",
        "The key just used to store the input ('number plate' or 'postcode')",
        "string"
      ),
      new supercharger.Parameter(
        "INTENT_TO_RESTART",
        "The intent to go back to when user says no ('NumberPlate' or 'Postcode')",
        "string"
      ),
      new supercharger.Parameter(
        "INTENT_TO_GO_TO",
        "The intent to go to when user says yes",
        "string"
      )
    ],

    // Supercharger Name
    "Update Changes To Policy",

    // Logic for supercharger
    (session, args, next, customArguments, skip) => {
      if (customArguments.KEY === "number plate") {
        const yesNoEntity = args.entities.find(
          entity => entity.type === "YES_NO"
        );
        if (
          yesNoEntity &&
          yesNoEntity.resolution.values.some(value => value === "yes")
        ) {
          let newVehicle = retrieveVehicleDetails(
            session.userData[customArguments.KEY]
          ).then(newVehicle => {
            updateVehicleDetails(
              session.userData.policies[0].policyMotorVersions[0],
              newVehicle
            );
            args.intent = customArguments.INTENT_TO_GO_TO;
            skip(session, args, next);
          });
        } else {
          delete session.userData[customArguments.KEY];
          args.intent = customArguments.INTENT_TO_RESTART;
          skip(session, args, next);
        }
      } else if (customArguments.KEY === "postcode") {
        // TODO sort out updating customer address
        session.send("We cannot update addresses at this time");
      } else {
        session.send(
          "Something went wrong and the details cannot be confirmed at this time"
        );
      }
    },

    // Supercharger ID
    "update_changes_to_policy"
  );
