const JSPath = require("jspath");
const logger = console;

const jsPaths = {
  cost: key => `.addOns.${key}`,
  isAlreadyOnPolicy: key =>
    `.policyDetails.policyMotorVersions[0].addOns{.name === "${key}"}.isAddedToPolicy`
};

const addOns = {
  breakdown: {
    cost: jsPaths.cost("breakdown"),
    isAlreadyOnPolicy: jsPaths.isAlreadyOnPolicy("Breakdown")
  },
  motorLegal: {
    cost: jsPaths.cost("motorLegal"),
    isAlreadyOnPolicy: jsPaths.isAlreadyOnPolicy("Motor Legal")
  },
  handbag: {
    cost: jsPaths.cost("handbag"),
    isAlreadyOnPolicy: jsPaths.isAlreadyOnPolicy("Handbag")
  },
  carHire: {
    cost: jsPaths.cost("carHire"),
    isAlreadyOnPolicy: jsPaths.isAlreadyOnPolicy("Car Hire:")
  },
  personalInjury: {
    cost: jsPaths.cost("personalInjury"),
    isAlreadyOnPolicy: jsPaths.isAlreadyOnPolicy("Personal Injury")
  },
  ncdProtection: {
    cost: jsPaths.cost("ncdProtection"),
    isAlreadyOnPolicy: jsPaths.isAlreadyOnPolicy("NCD Protection")
  }
};

const addOnIsAlreadyOnPolicy = (customArguments, session) => {
  let path = addOns[customArguments.ADD_ON_NAME].isAlreadyOnPolicy;
  console.log(`Checking ${path}: ${JSPath.apply(path, session.userData)[0]}`);
  return JSPath.apply(path, session.userData)[0];
};

module.exports = supercharger =>
  new supercharger.Detail(
    // Supercharger Parameters.
    [
      new supercharger.Parameter("ADD_ON_NAME", "Type of add on", "string"),
      new supercharger.Parameter("QUESTION", "The question to ask", "string"),
      new supercharger.Parameter(
        "NEXT_ADD_ON",
        "The name of the intent which starts the conversation flow of the next add on",
        "string"
      )
    ],

    // Supercharger Name
    "Upsell Question",

    // Logic for supercharger
    (session, args, next, customArguments, skip) => {
      if (addOnIsAlreadyOnPolicy(customArguments, session)) {
        args.intent = customArguments.NEXT_ADD_ON;
        logger.info(
          `[UPSELL-Q] customer has ${
            customArguments.ADD_ON_NAME
          } add-on already, setting intent to ${args.intent} and skipping`
        );
        session.userData.hasBeenAskedUpsellQ = false;
        skip(session, args, next);
      } else {
        logger.info(`[UPSELL-Q] customer does not have ${
          customArguments.ADD_ON_NAME
        } add-on, sending question 
                  ${customArguments.QUESTION} with intent: ${args.intent}`);
        session.userData.hasBeenAskedUpsellQ = true;
        session.send(customArguments.QUESTION);
      }
    },

    // Supercharger ID.
    "upsell_question"
  );
