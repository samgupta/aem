const builder = require('botbuilder');
const colours = require('../helpers/console_colours');

let askForLogin = function (session) {
  console.log(colours.FgCyan, 'No user found, sending sign in card', session.userData);
  const signInCard = new builder.SigninCard(session)
  .text('BotFramework Sign-in Card')
  .button('Sign-in', process.env.SIGN_IN_URL || 'http://esurelogin-hosting-mobilehub-1214971760.s3-website.eu-west-2.amazonaws.com/');

  // attach the card to the reply message
  const msg = new builder.Message(session).addAttachment(signInCard);
  session.send(msg);
};

let continueFlow = function (session, next) {
  console.log(colours.FgGreen, 'User found, calling next()');
  Object.assign(session.userData, session.message.address.user.summary);
  next();
};

module.exports = (middleware) => {
  // Register middleware
  console.log(colours.Bright,'Registering sign in middleware');
  middleware.store.register(new middleware.Middleware(true, false, (session, next) => {
    console.log(colours.Bright, 'Checking for user');
    console.log(colours.FgGreen, "Inbound messaging: " + session.message.text, session.message.address.user.summary);

    //We only want to check the summary for an email if it exists
    if (session.message.address.user.summary) {
      //They've sent a summary, check it contains an email, or that they've logged in previously
      if (session.message.address.user.summary.email || session.userData.email) {
        //They're logged in
        continueFlow(session, next);
      } else {
        //They haven't logged in
        askForLogin(session);
      }
    } else {
      //no summary, check if they're already logged in
      if (!session.userData.email) {
        //they're not logged in
        askForLogin(session);
      } else {
        //they've already logged in
        continueFlow(session, next);
      }
    }
  }));
}

