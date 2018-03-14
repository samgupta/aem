"use strict";
// Mocked data TODO replace static data with DB queries
const {
  pricesForAddons
} = require("./mock-data");

module.exports.getPricesForAddons = (event, context, callback) => {
  let response = {
    statusCode: 200,
    body: JSON.stringify(pricesForAddons)
  };
  callback(null, response);
};
