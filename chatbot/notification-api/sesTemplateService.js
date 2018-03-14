const colors = require("../helpers/console_colours");

const AWS = require('aws-sdk');
const REGION = process.env.SES_REGION || 'eu-west-1';
AWS.config.update({region: REGION});

const createEmailTemplate = (templateName, html, subject, text) => {
  // Create createTemplate params
  var params = {
    Template: {
      TemplateName: templateName,
      HtmlPart: html,
      SubjectPart: subject,
      TextPart: text
    }
  };
  // Create the promise and SES service object
  var templatePromise = new AWS.SES({apiVersion: '2010-12-01'}).createTemplate(params).promise();

  // Handle promise's fulfilled/rejected states
  templatePromise.then((data) => {
    console.log(colors.FgGreen, "[Email Template Created Successfully]", data);
  }).catch((err) => {
    console.error(colors.FgRed, "[Error Creating Email Template]: ", err, err.stack);
  });
}

const updateEmailTemplate = (templateName, html, subject, text) => {
  const params = {
    Template: {
      TemplateName: templateName,
      HtmlPart: html,
      SubjectPart: subject,
      TextPart: text
    }
  };

  var templatePromise = new AWS.SES({apiVersion: '2010-12-01'}).updateTemplate(params).promise();

  templatePromise.then(function(data) {
    console.log(colors.FgGreen, "[Email Template Updated Successfully]", data);
  }).switch (function(err) {
    console.error(colors.FgRed, "[Error Updating Email Template]: ", err, err.stack);
  });
}

const deleteEmailTemplate = (templateName) => {
  var templatePromise = new AWS.SES({apiVersion: '2010-12-01'}).deleteTemplate({TemplateName: templateName}).promise();

  templatePromise.then(function(data) {
    console.log(colors.FgGreen, "[Email Template Deleted Successfully]", data);
  }).catch(function(err) {
    console.error(colors.FgRed, "[Error Deleting Email Template]: ", err, err.stack);
  });
}
module.exports = {
  createEmailTemplate: createEmailTemplate,
  updateEmailTemplate: updateEmailTemplate,
  deleteEmailTemplate: deleteEmailTemplate
};