
import { AuthTypeDeclared } from "../../Common/structure"
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
    }

}