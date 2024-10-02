require("./Common/instrument")
import { Request ,Response , NextFunction } from 'express';
import user_controlling_routes from './Routes/user_routers/userRouter'
import admin_controlling_routes from './Routes/admin_routes/adminRoutes'
import connection_DB_estaiblished from './DB/DB/db_config'


const operatingSystem = require('os')
const clusterPremises = require('cluster')
const Sentry = require("@sentry/node");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();


connection_DB_estaiblished();


const server_configs = () => {

    const app = express()
    
    app.use(bodyParser.json())
    app.use(cors())
    Sentry.setupExpressErrorHandler(app);
    const PORT_ESTAIBLISHED = process.env.PORT_ESTAIBLISHED || 8000;
    app.use('/api/v1/', user_controlling_routes);
    app.use('/api/v1/controls', admin_controlling_routes)
    app.listen(PORT_ESTAIBLISHED, async () => {
        console.log(`Server running successfully on port ${PORT_ESTAIBLISHED}`);
    });
}


if ( clusterPremises.isMaster){
    const numCPUs = operatingSystem.cpus().length;
    console.log(`Master process ${process.pid} is running`);
    console.log(`Forking server for ${numCPUs} CPUs`);
    for ( let i =0 ; i < numCPUs ; i++){
        clusterPremises.fork()
    }
    clusterPremises.on('exit' , (worker: { process: { pid: any; }; } , code: any , signal: any)=>{
        console.log(`Worker ${worker.process.pid} died. Starting a new worker...`);
        clusterPremises.fork();
    })
}
else {
    server_configs()
}
