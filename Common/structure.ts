enum RolesSpecified {
    ADMIN_DESC = "admin",
    USER_DESC = "user"
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

export interface UserDocument extends Document {
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