const Mustache = require('mustache');
const logger = console;

module.exports = (supercharger) => new supercharger.Detail(
  // Supercharger Parameters.
  [
    new supercharger.Parameter(
      "INTENT",
      "The name of the intent",
      "string"
    )
  ],

  // Supercharger Name
  "Go to intent",

  // Logic for supercharger
  (session, args, next, customArguments, skip) => {
    logger.info("[GO-TO-INTENT] going to: " + customArguments.INTENT);
    args.intent = customArguments.INTENT;
    skip(session, args, next);
  },

  // Supercharger ID.
  "go_to_intent"
);