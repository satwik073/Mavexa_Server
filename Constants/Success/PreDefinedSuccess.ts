
import RolesSpecified, { AuthTypeDeclared, SuccessManager } from "../../Common/structure"

export const EMAIL_SESSION_RELAY = (user_type_specified : RolesSpecified ) =>({
    SUCCESS : (user_type_specified === RolesSpecified.USER_DESC) ? `Email Sent Successfully to ${RolesSpecified.USER_DESC} having EMAIL ID: `: (user_type_specified === RolesSpecified.ADMIN_DESC) ? `Email Sent Successfully to ${RolesSpecified.ADMIN_DESC} having EMAIL ID:` : null
})
export const SUCCESS_VALUES_FETCHER = {
    ENTITY_ONBOARDED_FULFILED: (user_auth_type_specified: AuthTypeDeclared, user_role_specified: RolesSpecified) => ({
        SUCCESS_MESSAGE: user_role_specified === RolesSpecified.ADMIN_DESC
            ? user_auth_type_specified === AuthTypeDeclared.USER_LOGIN
                ? `${RolesSpecified.ADMIN_DESC} ${AuthTypeDeclared.USER_LOGIN} successful`
                : user_auth_type_specified === AuthTypeDeclared.USER_REGISTRATION
                    ? `${RolesSpecified.ADMIN_DESC} ${AuthTypeDeclared.USER_REGISTRATION} successfully`
                    : null
            : user_role_specified === RolesSpecified.USER_DESC
                ? user_auth_type_specified === AuthTypeDeclared.USER_LOGIN
                    ? `${RolesSpecified.USER_DESC} ${AuthTypeDeclared.USER_LOGIN} successful`
                    : user_auth_type_specified === AuthTypeDeclared.USER_REGISTRATION
                        ? `${RolesSpecified.USER_DESC} ${AuthTypeDeclared.USER_REGISTRATION} successfully`
                        : null
                : null
    }),
    RETRIEVED_ENTITY_SESSION: (user_type_specified: RolesSpecified) => ({
        SUCCESS_MESSAGE: (user_type_specified === RolesSpecified.ADMIN_DESC) ? `${RolesSpecified.ADMIN_DESC} fetched Successfully`
            : (user_type_specified === RolesSpecified.USER_DESC) ? `${RolesSpecified.USER_DESC} fetched Successfully` : null
    }),
    USER_FOUND_OR_NOT_CONTROLLED: (user_detected: AuthTypeDeclared) => ({
        USER_LOGIN_MESSAGE: `User does not exists try ${AuthTypeDeclared.USER_LOGIN} using different Credentials`,
        USER_REGISTRATION_SUPPORT: `User Already exists try ${AuthTypeDeclared.USER_REGISTRATION.toLowerCase()}ing with different email`
    }),
    JWT_DETECTED_ERRORS: {
        JWT_NOT_DETECTED: `JWT secret key not detected in the request`
    },
    INVALID_CREDENTIALS_PROVIDED: (user_auth_type_specified: RolesSpecified) => ({
        INVALID_CREDENTIALS: (user_auth_type_specified === RolesSpecified.USER_DESC) ? `${RolesSpecified.USER_DESC.toLowerCase()} provided Invalid credentials, try using different ones` : `Invalid credentials, ${RolesSpecified.ADMIN_DESC.toLowerCase()} cannot log in through this endpoint.`
    })

}