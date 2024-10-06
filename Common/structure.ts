enum RolesSpecified {
    ADMIN_DESC = "admin",
    USER_DESC = "user",
    EMPTY = `Can't determine`
}
export enum AuthTypeDeclared{
    USER_REGISTRATION  = "Register",
    USER_LOGIN = "Login"
}

export enum DatabaseTrace {
    SUCCESS_FETCHING = 'Success',
    ERROR_ENCOUNTERED = 'Error',
    DEFAULT_PARAMETER = 'Default',
    DatabaseConnectionTrace= 'DatabaseConnectionTrace'
}
export enum VariantsType {
    TEXT = 'text',
    OTP_TRACES = 'otp'
}

export enum DefaultRequestMethods {
    GET ='GET', 
    POST='POST', 
    PUT='PUT', 
    DELETE ='DELETE', 
    OPT ='OPTIONS',
    PATCH = 'PATCH'
}

export interface UserDocument extends Document {
    is_user_verified: any;
    registered_username : string;
    registered_user_email: string;
    registered_user_password: string;
    authorities_provided_by_role : RolesSpecified
    _id: string;
}
export class SuccessManager {
    message_displayed : string;
    constructor(message_displayed : string) {
        this.message_displayed = 'DatabaseConnectionTrace'
    }

}
export class DatabaseExitTraceRemaining extends Error{
    constructor(error_message: string) {
        super(error_message)
        this.name = `DatabaseConnection`
    }
}

export interface SendingEmailToUser {
    senders_email: string;
    receivers_email: string;
    otp_for_verification: string;
    product_by_company: string;
    receivers_username: string;
}


export interface EmailDeliverablesContent {
    text_context : VariantsType.TEXT | VariantsType.OTP_TRACES,
    content_rendering : string,
}
export interface AdminDocument extends Document {
    admin_userEmail: string;
    admin_userPassword: string;
    authorities_provided_by_role : RolesSpecified
    _id: string;
}
export class UserAuthControllingError extends Error {
    constructor(error_message: string) {
        super(error_message)
        this.name = `UserNotExitsError`
    }
}

export class EmailResponseControllingError extends Error {
    constructor(error_message : string){
        super(error_message)
        this.name = `EmailTracesNotSent`
    }
}
export interface UserInput {
    user_registered_email?: string;
    user_entered_password?: string;
    user_entered_otp_request?: string;
    user_entered_userName?: string;
    admin_userEmail?: string;
    admin_userPassword?: string;
    admin_userName?: string;
  }
export default RolesSpecified