'use strict';

const AWS = require('aws-sdk'),
      dynamoDb = new AWS.DynamoDB.DocumentClient();
      
const params = {
  TableName: process.env.CUSTOMERS_TABLE || "customers-dev",
};

module.exports.list = (event, context, callback) => {
  // fetch all customers from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the customers.',
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