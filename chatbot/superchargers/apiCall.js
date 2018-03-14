const fetch = require('node-fetch');
const Mustache = require('mustache');

module.exports = (supercharger) => new supercharger.Detail(
  // Supercharger Parameters.
  [
    new supercharger.Parameter(
      "URL",
      "URL to call",
      "string"
    ),
    new supercharger.Parameter(
      "KEY",
      "Key to store response under",
      "string"
    )
  ],

  // Supercharger Name
  "Call API",

  // Logic for supercharger
  (session, args, next, customArguments, skip) => {
    const url = Mustache.render(customArguments.URL, session.userData);
    console.log(`Getting ${url}`);
    fetch(url)
    .then(res => res.json())
    .then((res) => {
      console.log(`Got ${JSON.stringify(res)}`);
      session.userData[customArguments.KEY] = res;
      skip(session, args, next);
    })

  },

  // Supercharger ID.
  "api_call"
);