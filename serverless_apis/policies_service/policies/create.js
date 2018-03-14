'use strict';
const uuid = require('uuid'),
      AWS = require('aws-sdk'),
      dynamoDb = new AWS.DynamoDB.DocumentClient();
      
module.exports.create = (event, context, callback) => {
  
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  
  if (typeof data.sourceSystem !== 'string') {
    console.error('[ERROR]400 :: Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the policy item.',
    });
    return;
  }
  
  var item = {
    id: uuid.v1(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  item = Object.assign(data, item);
  
  const params = {
    TableName: process.env.POLICIES_TABLE || "policies-dev",
    Item: item,
  };
  
  // write the Policy to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the Policy item.',
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