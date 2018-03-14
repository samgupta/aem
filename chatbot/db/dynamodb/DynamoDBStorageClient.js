// Import Dependencies
const dbcon = require("./connectionProvider");
const logger = console;

// Import Storage Model
const BotEntity = require("@capgemini-aie/yak/lib/state-storage/model/BotEntity");

const NOT_FOUND = "not_found";

/**
 * A StorageClient for DynamoDB/Cloudant implementing the
 * interface documented in IStorageClient (BotBuilder)
 * 
 * https://github.com/Microsoft/BotBuilder-Azure/blob/master/Node/src/IStorageClient.ts
 * 
 */
class DynamoDBStorageClient {
  /**
   * Constructs a new instance of DynamoDBStorageClient
   * @param {String} databaseName The name of the DynamoDB Database you'd like to store bot state in
   */
  constructor(databaseName) {
    // Store DB name for use in initialise
    this.__dbName = databaseName;
    logger.info("[DynamoDBStorageClient] Instantiated using DB: ", this.__dbName);
  }

  /**
   * The required initialise method as described in the interface
   * IStorageClient. Establishes DB connection.
   * 
   * @param {Function} callback A callback accepting a single error parameter (if error occured)
   */
  initialize(callback) {
    try {
      this.__db = dbcon.getConnection(this.__dbName);
      logger.info(
        "[DynamoDBStorageClient] Successfully Connected to DynamoDB using DB ",
        this.__dbName
      );
      callback();
    } catch (e) {
      logger.error(
        "[DynamoDBStorageClient] Failed to connect to DynamoDB using DB ",
        this.__dbName,
        e
      );
      callback(e);
    }
  }

  /**
   * Function used to insert or replace bot state in 
   * Storage (DynamoDB)
   * 
   * @param {String} partitionKey The partition name - used to identify the document
   * @param {String} rowKey The row key within the partition - used to identify the document
   * @param {*} entity The entity to be stored
   * @param {Boolean} isCompressed Boolean flag for if entity to be stored is compressed
   * @param {Function} callback Callback accepting 3 arguments: (error: any, etag: any, response: IHttpResponse)
   */
  insertOrReplace(partitionKey, rowKey, entity, isCompressed, callback) {
    let id = `${partitionKey},${rowKey}`;
    logger.info("[DynamoDBStorageClient] Insert/Replace at ID: ", id);
    this.__db.insert({
        _id: id,
        data: entity,
        isCompressed
      }).then(result => {
        logger.info("[DynamoDBStorageClient] Beginning Replace at ID: ", id);
        callback(null, null, {});
      }).catch(error => {
        logger.error(
          "[DynamoDBStorageClient] Unexpected error on insert/update: ",
          error
        );
        callback(error, null, null);
      });
  }

  /**
   * Function used to retrieve an entity from storage
   * given it's partitionKey and rowKey
   * 
   * @param {String} partitionKey The partition name - used to identify the document
   * @param {String} rowKey The row key within the partition - used to identify the document
   * @param {Function} callback Callback accepting 3 arguments: (error: any, entity: IBotEntity, response: IHttpResponse)
   */
  retrieve(partitionKey, rowKey, callback) {
    let id = `${partitionKey},${rowKey}`;
    logger.info("[DynamoDBStorageClient] Retrieve at ID: ", id);
    this.__db
      .get(id)
      .then(result => {
        logger.info("[DynamoDBStorageClient] Retrieved Doc with ID: ", id);
        let entity = new BotEntity(result.data, result.isCompressed);
        callback(null, entity, null);
      })
      .catch(error => {
        if (error.error === NOT_FOUND) {
          logger.info(
            "[DynamoDBStorageClient] Failed to retrieve as doc does not exist at ID: ",
            id
          );
          callback();
        } else {
          logger.error(
            "[DynamoDBStorageClient] Unexpected error on retrieve: ",
            error
          );
          callback(error, null, null);
        }
      });
  }
}

// Export class
module.exports = DynamoDBStorageClient;
