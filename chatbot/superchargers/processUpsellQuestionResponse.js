const logger = console;

const updatePolicy = session => {
  let addons = session.userData.policies[0].policyMotorVersions[0].addOns;
  for (let i = 0; i < addons.length; i++) {
    if (addons[i].name === session.userData.addonOffered) {
      addons[i].isAddedToPolicy = true;
    }
  }
};

module.exports = supercharger =>
  new supercharger.Detail(
    // Supercharger Parameters.
    [
      new supercharger.Parameter(
        "NEXT_INTENT",
        "Next intent to go to",
        "string"
      ),
      new supercharger.Parameter(
        "POSITIVE_RESPONSE",
        "Response when user says yes",
        "string"
      ),
      new supercharger.Parameter(
        "NEGATIVE_RESPONSE",
        "Response when user says no",
        "string"
      )
    ],

    // Supercharger Name
    "Process Upsell Question Response",

    // Logic for supercharger
    (session, args, next, customArguments, skip) => {
      if (session.userData.hasBeenAskedUpsellQ) {
        const yesNoEntity = args.entities.find(entity => entity.type === "YES_NO");
        //Reset question flag now we're processing it
        session.userData.hasBeenAskedUpsellQ = false;
        if (yesNoEntity && yesNoEntity.resolution.values.some(value => value === "yes")) {
          logger.info(
            `[UPSELL-Q] customer wants add-on, sending a response, setting intent to ${args.intent} and skipping`);
          session.send(customArguments.POSITIVE_RESPONSE);
          args.intent = customArguments.NEXT_INTENT;
          updatePolicy(session);
          skip(session, args, next);
        } else {
          session.send(customArguments.NEGATIVE_RESPONSE);
          args.intent = customArguments.NEXT_INTENT;
          logger.info(
            `[UPSELL-Q] customer does not want add-on, sending a response, setting intent to ${
              args.intent
            } and skipping`
          );
          skip(session, args, next);
        }
      } else {
        logger.info(`[UPSELL-Q] upsell question has not been asked, skipping`);
        args.intent = customArguments.NEXT_INTENT;
        skip(session, args, next);
      }
    },

    // Supercharger ID.
    "process_upsell_question_response"
  );
