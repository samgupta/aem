//=========================================================
// Import NPM modules
//=========================================================
require("dotenv").config();
const express = require("express");
const actionsOnGoogleAdapter = require("bot-framework-actions-on-google")(process.env.DIRECT_LINE_SECRET, process.env.CONVO_TIMEOUT || 60000, false);
const AWS = require("aws-sdk");
const awsConfig = {
  region: process.env.AWS_REGION || 'eu-west-2'
};

AWS.config.update(awsConfig);
var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
 
const app = express();

app.get('/health', (req, res) => res.sendStatus(200));
app.use(actionsOnGoogleAdapter.router);

actionsOnGoogleAdapter.onUserSignedInHandlerProvider.registerHandler((user) => {
  return new Promise((resolve, reject) => {
    cognitoIdentityServiceProvider.getUser({AccessToken: user.accessToken}, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      const userAttributes = res.UserAttributes.reduce((accumulator, attribute) => {
        accumulator[attribute.Name] = attribute.Value
        return accumulator;
      }, {});
      const userDetails = {
        username: res.Username,
        ...userAttributes
      };
      console.log('Got user from aws cognito: ', userDetails);
      resolve(userDetails);
    })
  })
})
 
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => console.log(`ActionsOnGoogle listening on port ${PORT}!`));