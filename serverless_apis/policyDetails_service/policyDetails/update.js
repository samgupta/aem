'use strict';

const AWS = require('aws-sdk'),
      dynamoDb = new AWS.DynamoDB.DocumentClient();
      
module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.sourceSystem !== 'string' || typeof data.policyNumber !== 'number') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the policy details item.',
    });
    return;
  }

  const params = {
    TableName: process.env.POLICYDETAILS_TABLE || "policy-details-dev",
    Key: {
      policyNumber: event.pathParameters.policyNumber,
    },
    ExpressionAttributeValues: {
      ':updatedAt': timestamp,
      ':policyNumber': data.policyNumber,
      ':policyMotorVersions': data.policyMotorVersions
    },
    UpdateExpression: 'SET updatedAt = :updatedAt, policyNumber = :policyNumber, policyMotorVersions = :policyMotorVersions',
    ReturnValues: 'ALL_NEW',
  };

  // update the policy details in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(`[[ERROR 501]] :: ${error} - TIME: ${new Date().toTimeString()}`);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the policy details item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};