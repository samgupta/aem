require("dotenv").config();
const colours = require('./helpers/console_colours');
const express = require("express");
const YakInTheBox = require("@capgemini-aie/yak-in-the-box");
const cookieParser = require("cookie-parser");
const uiAuthMiddleware = require("./express/middleware/uiAuthentication");
const middlewareStore = YakInTheBox.yakMiddleware.store;

const app = express();

// Define credentials
const credentials = new YakInTheBox.BotConfig(
  new YakInTheBox.DatabaseCredentials(
    process.env.KNOWLEDGE_DB_NAME,
    process.env.CONVERSATION_DB_NAME,
    process.env.SUPERCHARGER_DB_NAME,
    process.env.CONVERSATION_HISTORY_DB_NAME,
    process.env.PREFERENCES_DB_NAME
  )
);
const dynamoConnectionProvider = require('./db/dynamodb/connectionProvider');
const dynamoStorageClient = require('./storage');
YakInTheBox.database.registerProvider(dynamoConnectionProvider);
YakInTheBox.storage.registerBotStateStorage(dynamoStorageClient);

// Register Superchargers
const superchargerRegistrar = require('./superchargers/registrar');
superchargerRegistrar(YakInTheBox.supercharger);

// Register conversation middleware
const signInMiddleware = require('./middleware/signIn');
signInMiddleware(YakInTheBox.yakMiddleware);
const fetchUserDataMiddleware = require('./middleware/fetchUserData');
const dateFunctionsMiddleware = require('./middleware/addDateFunctions');
middlewareStore.register(fetchUserDataMiddleware);
middlewareStore.register(dateFunctionsMiddleware);

// Construct middleware
const yakInTheBox = YakInTheBox.middleware(credentials);

//Health endpoint so we know the container is up
app.get('/health', (req, res) => res.sendStatus(200));
// Use middleware in express (it's exposed as a Router)
app.use(cookieParser());
app.use("/", uiAuthMiddleware(process.env.USERNAME, process.env.PASSWORD, Date.now() * Math.random() + "1a"));
app.use("/", yakInTheBox);

let port = process.env.PORT || 3978;
app.listen(port, () =>
  console.log(colours.FgGreen, `Esure chatbot app listening on port ${port}`)
);
