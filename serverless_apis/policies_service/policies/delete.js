'use strict';

const AWS = require('aws-sdk'),
      dynamoDb = new AWS.DynamoDB.DocumentClient();
      
module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.POLICIES_TABLE || "policies-dev",
    Key: {
      policyNumber: event.pathParameters.policyNumber,
    },
  };

  // delete the policy from the database
  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the policy item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.item),
    };
    callback(null, response);
  });
};