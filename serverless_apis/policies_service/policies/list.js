'use strict';

const AWS = require('aws-sdk'),
      dynamoDb = new AWS.DynamoDB.DocumentClient();
      
const params = {
  TableName: process.env.POLICIES_TABLE || "policies-dev",
};

module.exports.list = (event, context, callback) => {
  // fetch all policies from the database
  console.log("[[Params]] :: ", params);
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the policies.',
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