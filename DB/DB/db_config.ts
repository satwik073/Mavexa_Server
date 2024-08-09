import mongoose from "mongoose";


const connection_DB_estaiblished = async() =>{
    try{
        const url_session = process.env.MONGO_DB_URL_ESTAIBLISHED
        if( !url_session) throw new Error('MONGO_DB_URL_ESTAIBLISHED is not defined in environment variables');
        await mongoose.connect(url_session).then(()=>{
            console.log("Connection successfuly estaiblished between client and server")
        }).catch((error_value_displayed)=>{
            console.log(error_value_displayed, "Connection between client and server can't be estaiblished")
        })
    }catch{
        console.log("Something went wrong")
    }
}
export default connection_DB_estaiblished