const convertToAlphanumeric = require("../functions/convertToAlphanumeric");

module.exports = supercharger =>
  new supercharger.Detail(
    // Supercharger Parameters
    [
      new supercharger.Parameter(
        "KEY",
        "The key to store the input ('number plate' or 'postcode')",
        "string"
      )
    ],

    // Supercharger Name
    "Store Alphanumeric Conversion",

    // Logic for supercharger
    (session, args, next, customArguments, skip) => {
      session.userData[customArguments.KEY] = convertToAlphanumeric(
        session.userData[customArguments.KEY]
      );
    },

    // Supercharger ID
    "store_alphanumeric_conversion"
  );
