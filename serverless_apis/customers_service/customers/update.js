'use strict';

const AWS = require('aws-sdk'),
      dynamoDb = new AWS.DynamoDB.DocumentClient();
      
module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.title !== 'string' || typeof data.forename !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the customer item.',
    });
    return;
  }

  const params = {
    TableName: process.env.CUSTOMERS_TABLE || "customers-dev",
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ':updatedAt': timestamp,
      ':barredFlag': data.barredFlag,
      ':complaintMade': data.complaintMade,
      ':customerAddresses': data.customerAddresses,
      ':customerBars': data.customerBars,
      ':customerPolicies': data.customerPolicies,
      ':customerPreferences': data.customerPreferences,
      ':dateOfBirth': data.dateOfBirth,
      ':firstContactDate': data.firstContactDate,
      ':firstContactMethod': data.firstContactMethod,
      ':firstContactMethodDescription': data.firstContactMethodDescription,
      ':forename': data.forename,
      ':sex': data.sex,
      ':surname': data.surname,
      ':title': data.title
    },
    UpdateExpression: 'SET updatedAt = :updatedAt, barredFlag = :barredFlag, complaintMade = :complaintMade, customerAddresses = :customerAddresses, customerBars = :customerBars, customerPolicies = :customerPolicies, customerPreferences = :customerPreferences, dateOfBirth = :dateOfBirth, firstContactDate = :firstContactDate, firstContactMethod = :firstContactMethod, firstContactMethodDescription = :firstContactMethodDescription, forename = :forename, sex = :sex, surname = :surname, title = :title',
    ReturnValues: 'ALL_NEW',
  };

  // update the customer in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(`[[ERROR 501]] :: ${error} - TIME: ${new Date().toTimeString()}`);
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