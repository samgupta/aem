const moment = require('moment');

const expiryDatePlusOneYear = function() {
  return moment(this.expiryDate).add(1, 'years').format("dddd, MMMM Do YYYY")
};

const expiryDatePlusOneDay = function() {
  return moment(this.expiryDate).add(1, 'days').format("dddd, MMMM Do YYYY")
};

const readableExpiryDate = function() {
  return moment(this.expiryDate).format("dddd, MMMM Do YYYY");
};

const readableRelativeExpiryDate = function() {
  return moment().add(3, 'weeks').format("dddd, MMMM Do YYYY");
};

const readableRelativeStartDate = function() {
  return moment().add(3, 'weeks').add(1, 'days').format("dddd, MMMM Do YYYY");
};

const readableRelativeEndDate = function() {
  return moment().add(3, 'weeks').add(1, 'years').format("dddd, MMMM Do YYYY");
};

module.exports.expiryDatePlusOneYear = expiryDatePlusOneYear;
module.exports.expiryDatePlusOneDay = expiryDatePlusOneDay;
module.exports.readableExpiryDate = readableExpiryDate;
module.exports.readableRelativeExpiryDate = readableRelativeExpiryDate;
module.exports.readableRelativeStartDate = readableRelativeStartDate;
module.exports.readableRelativeEndDate = readableRelativeEndDate;