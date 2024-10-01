require("./Common/instrument")
import { Request ,Response , NextFunction } from 'express';
import user_controlling_routes from './Routes/user_routers/userRouter'
import admin_controlling_routes from './Routes/admin_routes/adminRoutes'
import connection_DB_estaiblished from './DB/DB/db_config'

const Sentry = require("@sentry/node");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();

connection_DB_estaiblished();

const app = express()

app.use(bodyParser.json())
app.use(cors())

const PORT_ESTAIBLISHED = process.env.PORT_ESTAIBLISHED || 8000;

app.use('/api/v1/', user_controlling_routes);
app.use('/api/v1/controls', admin_controlling_routes)
Sentry.setupExpressErrorHandler(app);
app.listen(PORT_ESTAIBLISHED, async () => {
    console.log(`Server running successfully on port ${PORT_ESTAIBLISHED}`);
});