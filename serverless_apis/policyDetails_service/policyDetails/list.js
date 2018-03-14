'use strict';

const AWS = require('aws-sdk'),
      dynamoDb = new AWS.DynamoDB.DocumentClient();
      
const params = {
  TableName: process.env.POLICYDETAILS_TABLE || "policy-details-dev",
};

module.exports.list = (event, context, callback) => {
  // fetch all policy details from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the policy details.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};