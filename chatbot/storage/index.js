// Get BotBuilder Azure client
const bbAzure = require("botbuilder-azure");

// Import custom storage client
const DynamoDBStorageClient = require("../db/dynamodb/DynamoDBStorageClient");

// Define Constants
const DB_NAME = process.env.STATE_DB_NAME || 'state';

// Construct Bot Storage as Azure Bot Storage
module.exports = new bbAzure.AzureBotStorage(
  { gzipData: false },
  // Pass Custom StorageClient
  new DynamoDBStorageClient(DB_NAME)
);
