const YakInTheBox = require("@capgemini-aie/yak-in-the-box");
const fetch = require("node-fetch");
const Middleware = YakInTheBox.yakMiddleware.Middleware;
const readableTime = require("../helpers/returnReadableTime");

module.exports = new Middleware(true, false, (session, next) => {
  if (!session.userData.policies || !session.userData.customerDetails) {
    const customerId = session.userData.sub || process.env.CUSTOMER_MOCK_ID || "34507f1b-14f8-4b01-9435-a4726b501a11";
    const url = `${process.env.CUSTOMER_API_ENDPOINT}/customers/${customerId ||
      ""}`;
    console.log(`Executing fetch user data middleware`, url);
    fetch(url)
      .then(res => res.json())
      .then(res => {
        console.log(`Got user data, ${res}`);
        // Store response
        session.userData.customerDetails = res;
        let requests = res.customerPolicies.map(policy =>
          fetch(
            `${process.env.POLICY_DETAILS_API_ENDPOINT}/policy-details/${
              policy.policyNumber
            }`
          )
            .then(res => res.json())
            .catch(err => Promise.resolve({}))
        );
        return Promise.all(requests);
      })
      .then(policies => {
        console.log(`Got user policies, ${policies}`);
        session.userData.policies = policies;
      })
      .then(next)
      .catch((err) => {
        console.error(err);
        next()
      });
  } else {
    next();
  }
});
