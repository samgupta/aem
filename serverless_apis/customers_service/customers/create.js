'use strict';
const uuid = require('uuid'),
      AWS = require('aws-sdk'),
      dynamoDb = new AWS.DynamoDB.DocumentClient();
      
module.exports.create = (event, context, callback) => {
  
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.title !== 'string') {
    console.error('[ERROR]400 :: Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the customer item.',
    });
    return;
  }
  
  var customer = {
    id: uuid.v1(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  customer = Object.assign(customer, data);
  
  const params = {
    TableName: process.env.CUSTOMERS_TABLE || "customers-dev",
    Item: customer,
  };
  
  // write the customer to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the customer item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};