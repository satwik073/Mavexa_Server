import mongoose from "mongoose";
import { DATABASE_CONNECTION_REQUEST_HANDLER, DEFAULT_EXECUTED } from "../../Constants/Errors/PreDefinedErrors";
import { DatabaseTrace } from "../../Common/structure";
import { DATABASE_CONDTIONALS } from "../../Middlewares/Error/ErrorHandlerReducer";
import {ASYNC_ERROR_HANDLER_ESTAIBLISHED} from '../../Middlewares/Error/ErrorHandlerReducer'

const connection_DB_estaiblished = ASYNC_ERROR_HANDLER_ESTAIBLISHED( async() =>{
    const url_session = process.env.MONGO_DB_URL_ESTAIBLISHED
    await DATABASE_CONDTIONALS(url_session)
})
export default connection_DB_estaiblished