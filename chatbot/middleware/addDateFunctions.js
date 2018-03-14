const YakInTheBox = require("@capgemini-aie/yak-in-the-box");
const Middleware = YakInTheBox.yakMiddleware.Middleware;
const readableTime = require("../helpers/returnReadableTime");

module.exports = new Middleware(true, false, (session, next) => {
  if (!session.userData.readableExpiryDate) {
    session.userData.readableExpiryDate = readableTime.readableExpiryDate;
    session.userData.expiryDatePlusOneDay = readableTime.expiryDatePlusOneDay;
    session.userData.expiryDatePlusOneYear = readableTime.expiryDatePlusOneYear;
    session.userData.readableRelativeExpiryDate = readableTime.readableRelativeExpiryDate;
    session.userData.readableRelativeStartDate = readableTime.readableRelativeStartDate;
    session.userData.readableRelativeEndDate = readableTime.readableRelativeEndDate;
  }
  next()
});
