require("./Common/instrument")
const Sentry = require("@sentry/node");
const express = require('express')
import { configDotenv } from 'dotenv'
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
import user_controlling_routes from './Routes/user_routers/userRouter'
import connection_DB_estaiblished from './DB/DB/db_config'
const app = express()
app.use(bodyParser.json())
app.use(cors())

dotenv.config();
const PORT_ESTAIBLISHED = process.env.PORT_ESTAIBLISHED || 8000;
if (!PORT_ESTAIBLISHED) {
    console.log("Can't reach out to port");
} else {
    app.use('/api/v1/', user_controlling_routes);
    Sentry.setupExpressErrorHandler(app);
    app.listen(PORT_ESTAIBLISHED, async () => {
        await connection_DB_estaiblished();
        console.log(`Server running successfully on port ${PORT_ESTAIBLISHED}`);
    });
}
