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
      body: 'Couldn\'t update the customer item.',
    });
    return;
  }

  const params = {
    TableName: process.env.POLICIES_TABLE || "policies-dev",
    Key: {
      policyNumber: event.pathParameters.policyNumber,
    },
    ExpressionAttributeValues: {
      ':updatedAt': timestamp,
      ':sourceSystem': data.sourceSystem,
      ':policyNumber': data.policyNumber,
      ':policyDocumentDetails': data.policyDocumentDetails
    },
    UpdateExpression: 'SET updatedAt = :updatedAt, sourceSystem = :sourceSystem, policyNumber = :policyNumber, policyDocumentDetails = :policyDocumentDetails',
    ReturnValues: 'ALL_NEW',
  };

  // update the customer in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the customer item.',
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