const AWS = require("aws-sdk");
const uuidv4 = require('uuid/v4');

let config = {
  region: process.env.AWS_REGION || 'eu-west-2'
};
if (process.env.AWS_DYNAMODB_ENDPOINT) {
  config.endpoint = process.env.AWS_DYNAMODB_ENDPOINT;
}
AWS.config.update(config);
console.log('Connecting to dynamodb with config: ', AWS.config);

const promisifiedReq = (client, method, params = {}) => new Promise((resolve, reject) => {
  client[method](params, (err, data) => {
    if (err) {
      console.log('Error occurred interacting with DynamoDB', err);
      reject({reason: err})
    } else {
      resolve(data)
    }
  })
});

const removeNullsUndefinedsAndEmptyStrings = (o) => {
  if (o !== undefined && o === o) {
    if (Array.isArray(o)) {
      let x = [], i = -1, l = o.length, r = 0;
      while (++i < l) if (o[i]) x[r++] = removeNullsUndefinedsAndEmptyStrings(o[i]);
      return x;
    } else if (typeof o === 'object') {
      for (const k in o) o[k] === undefined || o[k] === null || o[k] === '' ? delete o[k] : o[k] = removeNullsUndefinedsAndEmptyStrings(o[k]);
      return o;
    } else {
      return o;
    }
  }
};

const createTableIfNotCreated = (dynamodb, dbCredentials) => {
  let checkedTableIsCreated = false;
  let checkedTableRequest;
  return () => {
    if (!checkedTableIsCreated) {
      return promisifiedReq(dynamodb, 'listTables')
      .then(data => {
        if (!data.TableNames.includes(dbCredentials.dbName)) {
          if (checkedTableRequest) {
            return checkedTableRequest;
          }
          console.log(`${JSON.stringify(data.TableNames)} doesn't include ${dbCredentials.dbName} so creating it`);
          checkedTableRequest = promisifiedReq(dynamodb, 'createTable', {
            AttributeDefinitions: [
              {
                AttributeName: "_id",
                AttributeType: "S"
              }
            ],
            KeySchema: [
              {
                AttributeName: "_id",
                KeyType: "HASH"
              }
            ],
            ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5
            },
            TableName: dbCredentials.dbName
          });
          return checkedTableRequest
        } else {
          return Promise.resolve(true)
        }
      }).then(() => {
        checkedTableIsCreated = true;
      })
    } else {
      return Promise.resolve(true)
    }
  }
}

/**
 * Create a cloudant DB connection assuming the code
 * is running in BlueMix. If VCAP is not present then
 * assumes running in development mode and falls back
 * to env variable CLOUDANT_BASIC_AUTH_URL
 */
function initDBConnection(dbName) {
  const dbCredentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    dbName: dbName
  };
  const dynamodb = new AWS.DynamoDB({
    accessKeyId: dbCredentials.accessKeyId,
    secretAccessKey: dbCredentials.secretAccessKey
  });
  const docClient = new AWS.DynamoDB.DocumentClient({
    service: dynamodb
  });
  const createTable = createTableIfNotCreated(dynamodb, dbCredentials);
  createTable();
  return {
    get: (id) => {
      const params = {
        TableName: dbCredentials.dbName,
        Key: {_id: id}
      };
      return createTable().then(() => promisifiedReq(docClient, 'get', params)).then(doc => {
        if (doc.Item) {
          return doc.Item
        } else {
          throw {error: 'not_found', statusCode: 404, reason: 'Not found'}
        }
      });
    },
    list: () => {
      const params = {
        TableName: dbCredentials.dbName
      };
      return createTable()
      .then(() => promisifiedReq(docClient, 'scan', params))
      .then((data) => {
        return {...data, rows: data.Items.map(item => ({id: item._id, value: item, doc: item}))};
      });
    },
    insert: (data) => {
      let id = uuidv4();
      const params = {
        TableName: dbCredentials.dbName,
        Item: Object.assign({}, {
          _id: id
        }, removeNullsUndefinedsAndEmptyStrings(data))
      };
      console.log(`Creating: `, params);
      return createTable().then(() => promisifiedReq(docClient, 'put', params)).then((created) => {
        console.log('Created: ', created);
        return {
          id: id,
          ...created
        }
      }).catch(err => {
        console.log(err);
        return {reason: err || 'Unknown', statusCode: 500}
      });
    },
    destroy: (id) => {
      const params = {
        TableName: dbCredentials.dbName,
        Key: {
          _id: id
        }
      };
      return createTable().then(() => promisifiedReq(docClient, 'delete', params));
    },
    bulk: (requests) => {

      const params = {
        RequestItems: {}
      };
      params.RequestItems[dbCredentials.dbName] = requests.docs.map((request) => {
        if (request._deleted === true) {
          return {
            DeleteRequest: {
              Key: {_id: request._id}
            }
          }
        } else {
          return {
            PutRequest: {
              Item: request
            }
          }
        }
      });
      if (params.RequestItems[dbCredentials.dbName].length > 0) {
        return createTable().then(() => promisifiedReq(docClient, 'batchWrite', params));
      } else {
        return Promise.resolve()
      }
    }
  };
}

module.exports = {
  getConnection: db_name => {
    return initDBConnection(db_name);
  },
  removeNullsUndefinedsAndEmptyStrings
};
