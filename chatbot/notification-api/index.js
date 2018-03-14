const AWS = require('aws-sdk');
const colors = require('../helpers/console_colours');

// IAM role credentials and region
const AWS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const SNS_REGION = process.env.SNS_REGION || 'eu-west-1'; // SNS and SES are not available in eu-west-2
const SOURCE_EMAIL= process.env.SOURCE_EMAIL || "esureinnovationlab@gmail.com"; //Email address must be verified in the region used

AWS.config.update({
  accessKeyId: AWS_KEY,
  secretAccessKey: AWS_SECRET,
  region: SNS_REGION
});
const sns = new AWS.SNS({});
const ses = new AWS.SES({
  endpoint: 'https://email.eu-west-1.amazonaws.com'
});

/**
 * [Sends an SMS to a phone number]
 * @param  {string} msg      
 * @param  {string} phoneNum A phone number in E.164 format without spaces
 * @param  {string} subject  
 */
const publishMsgToNumber = (msg, phoneNum, subject) => {
  const params = {
    Message: msg,
    MessageStructure: 'string',
    Subject: (subject || 'NOTICE'),
    PhoneNumber: phoneNum
  };
  
  sns.publish(params, function(err, data) {
    if (err) console.log(colors.FgRed, "[[ERROR SENDING SMS]] :: ", err);
    else     console.log(colors.FgGreen, "[[SMS SENT SUCCESSFULLY]] :: ", data);
  });
};

/**
 * sendTemplatedEmail
 * @param  {string} templateName 
 * @param  {array} emails       array of [emails]
 * @param  {object} templateData ex: {"name": "Sam", "amount": "200"}
 */
const sendTemplatedEmail = (templateName, emails, templateData) => {
  const data = JSON.stringify(templateData);
  const params = {
    Destination: { /* required */
      ToAddresses: emails
    },
    Source: SOURCE_EMAIL, /* required */
    Template: templateName, /* required */
    TemplateData: data, /* required */
    ReplyToAddresses: [
        SOURCE_EMAIL
    ],
  };

  ses.sendTemplatedEmail(params)
  .promise().then((data) => {
    console.log(colors.FgGreen, "[[EMAIL SENT SUCCESSFULLY]] :: ", data);
  }).catch((err) => {
    console.log(colors.FgRed, "[[ERROR SENDING EMAIL]] :: ", err);
  });
};

module.exports = {
  publishMsgToNumber: publishMsgToNumber,
  sendTemplatedEmail: sendTemplatedEmail
};