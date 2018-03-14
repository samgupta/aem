module.exports = supercharger => {
  supercharger.register(require("./apiCall")(supercharger));
  supercharger.register(require("./upsellQuestion")(supercharger));
  supercharger.register(
    require("./processUpsellQuestionResponse")(supercharger)
  );
  supercharger.register(require("./goToIntent")(supercharger));
  supercharger.register(require("./offerAddon")(supercharger));
  supercharger.register(require("./storeAlphanumericConversion")(supercharger));
  supercharger.register(require("./notifyCustomer")(supercharger));
  supercharger.register(require("./updateChangesToPolicy")(supercharger));
  supercharger.register(require("./showPolicyEchoShow")(supercharger));
};
