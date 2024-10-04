
import RolesSpecified, { AuthTypeDeclared, DatabaseTrace } from "../../Common/structure"

export const DEFAULT_EXECUTED = {
    ERROR : 'Something went wrong',
    MISSING_USER  : (user_roles_specified : RolesSpecified) =>({
        MESSAGE : (user_roles_specified === RolesSpecified.ADMIN_DESC) ? `${RolesSpecified.ADMIN_DESC} account doesn't exists` : (user_roles_specified === RolesSpecified.USER_DESC) ? `${RolesSpecified.USER_DESC} account doesn't exists` : `Can't determine`
    }) 
}
export const ERROR_VALUES_FETCHER = {
    EMPTY_FIELDS_VALIDATOR :(user_auth_type_specified : AuthTypeDeclared ) => ({
        MESSAGE : `All fields are required to ${user_auth_type_specified.toLowerCase()} the user`
    }),
    USER_FOUND_OR_NOT_CONTROLLED : (user_detected : AuthTypeDeclared)=>({
        USER_LOGIN_MESSAGE : `User does not exists try ${AuthTypeDeclared.USER_LOGIN} using different Credentials`,
        USER_REGISTRATION_SUPPORT : `User Already exists try ${AuthTypeDeclared.USER_REGISTRATION.toLowerCase()}ing with different email`
    }),
    JWT_DETECTED_ERRORS : {
        JWT_NOT_DETECTED : `JWT secret key not detected in the request`
    },
    INVALID_CREDENTIALS_PROVIDED :(user_auth_type_specified: RolesSpecified) => ({
        INVALID_CREDENTIALS : (user_auth_type_specified === RolesSpecified.USER_DESC)? `${RolesSpecified.USER_DESC.toLowerCase()} provided Invalid credentials, try using different ones` : `Invalid credentials, ${RolesSpecified.ADMIN_DESC.toLowerCase()} cannot log in through this endpoint.`
    })

}

export const DATABASE_CONNECTION_REQUEST_HANDLER = {
    DATABASE_CONNECTION_REQUEST : (database_connection_request : DatabaseTrace) => ({
        MESSAGE : ( database_connection_request === DatabaseTrace.SUCCESS_FETCHING ) ? `🆗 Connection ${DatabaseTrace.SUCCESS_FETCHING}fuly estaiblished between client and server` : (database_connection_request === DatabaseTrace.ERROR_ENCOUNTERED) ? `Connection between client and server can't be estaiblished` : (database_connection_request === DatabaseTrace.DEFAULT_PARAMETER) ? `MONGO_DB_URL_ESTAIBLISHED is not defined in environment variables` :`Connection between client and server can't be estaiblished`
    })
}
