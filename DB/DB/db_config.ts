import { DATABASE_CONDTIONALS } from "../../Middlewares/Error/ErrorHandlerReducer";
import {ASYNC_ERROR_HANDLER_ESTAIBLISHED} from '../../Middlewares/Error/ErrorHandlerReducer';
const dotenv = require('dotenv')
dotenv.config();

const connection_DB_estaiblished = ASYNC_ERROR_HANDLER_ESTAIBLISHED( async() =>{
    const url_session = process.env.MONGO_DB_URL_ESTAIBLISHED?.toString() || ''; 
    await DATABASE_CONDTIONALS(url_session)
})
export default connection_DB_estaiblished