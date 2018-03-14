require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const alexaSkill = require("@capgemini-aie/bot-framework-alexa-skill");
const AWS = require("aws-sdk");

const app = express();
const awsConfig = {
  region: process.env.AWS_REGION || 'eu-west-2'
};
AWS.config.update(awsConfig);
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const PATH_PREFIX = process.env.ALEXA_BRIDGE_PATH_PREFIX || '';

const restingDirective = {
  "type": "Display.RenderTemplate",
  "template": {
    "type": "BodyTemplate6",
    "token": "Esure_Welcome",
    "backButton": "HIDDEN",
    "backgroundImage": {
      "contentDescription": "A Background Image",
      "sources": [
        {
          "url": "https://s3.eu-west-2.amazonaws.com/esure-voice-poc-images/brand/esure-voice-background.png",
          "size": "LARGE",
          "widthPixels": 1024,
          "heightPixels": 600
        },
      ]
    },
    "textContent": {
      "primaryText": {
        "text": '<font size="3"><b>Welcome to esure Voice Services</b></font>',
        "type": "RichText"
      },
      "secondaryText": {
        "text": '<font size="1"><i>Try asking me to renew your insurance</i></font>',
        "type": "RichText"
      }
    }
  }            
};

const directiveFactory = (context) => {
  if (context.System && context.System.device.supportedInterfaces.Display) {
    return [restingDirective];
  } else {
    return [];
  }
}

app.use(bodyParser.json());
app.get(PATH_PREFIX + "/health", (req, res) => res.sendStatus(200));
app.use(PATH_PREFIX + "/messages", alexaSkill(process.env.DIRECT_LINE_SECRET, process.env.CONVERSATION_TIMEOUT, directiveFactory, (req, res, state) => {
  return new Promise((resolve, reject) => {
    console.log("Inbound message: ", req.body);
    if (req.body.session.user.accessToken && (!state.userAccessToken || (state.userAccessToken !== req.body.session.user.accessToken))) {
      cognitoidentityserviceprovider.getUser({
        AccessToken: req.body.session.user.accessToken
      }, (err, user) => {
        if (err) {
          // Error occurred, log it and resolve with state;
          console.error(err);
          resolve(state);
        } else {
          const userAttributes = user.UserAttributes.reduce((accumulator, attribute) => {
            accumulator[attribute.Name] = attribute.Value
            return accumulator;
          }, {});
          const userDetails = {
            ...state,
            username: user.Username,
            ...userAttributes
          };
          console.log('State after merging user from aws cognito: ', userDetails);
          resolve(userDetails);
        }
      });
    } else {
      // Already signed in, resolve with state
      resolve(state);
    }
  });
}));

app.listen(process.env.PORT || 8080, () => console.log("App running on port: " + (process.env.PORT || "8080")));
