import { Request, Response } from "express";
import user_detailed_description from "../../Model/user_model/UserRegisteringModal";
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

import { email_service_enabled } from "../../Services/EmailServices";
import { EXISTING_USER_FOUND_IN_DATABASE, MISSING_FIELDS_VALIDATOR, TRACKING_DATA_OBJECT } from "../../Middlewares/Error/ErrorHandlerReducer";
import RolesSpecified, { AuthTypeDeclared } from "../../Common/structure";
import { DECODING_INCOMING_SECURITY_PASSCODE, JWT_KEY_GENERATION_ONBOARDED, OTP_GENERATOR_CALLED, SECURING_PASSCODE } from "../../Constants/Functions/CommonFunctions";
import { DEFAULT_EXECUTED, ERROR_VALUES_FETCHER } from "../../Constants/Errors/PreDefinedErrors";
import { HTTPS_STATUS_CODE } from "../../server";
import { SUCCESS_VALUES_FETCHER } from "../../Constants/Success/PreDefinedSuccess";
import { NOTFOUND } from "dns";


interface UserRegisterRequest {
    registered_username: string;
    registered_user_email: string;
    registered_user_password: string;
}

interface AuthenticatedRequest extends Request {
    user?: any;
}
interface UserLoginRequest {
    registered_user_email: string;
    registered_user_password: string;
}
interface UserVerificationMethod {
    otp_for_verification: string
}

export const letting_user_registered = async (request: Request<{}, {}, UserRegisterRequest>, response: Response) => {
    try {

        const { registered_username, registered_user_email, registered_user_password } = request.body;
        const is_exists_missing_fields = MISSING_FIELDS_VALIDATOR({ registered_user_email, registered_user_password, registered_username }, response, AuthTypeDeclared.USER_REGISTRATION)
        if (is_exists_missing_fields) return is_exists_missing_fields
        await EXISTING_USER_FOUND_IN_DATABASE(registered_user_email, AuthTypeDeclared.USER_REGISTRATION, RolesSpecified.USER_DESC)
        const otp_generating_code_block = await OTP_GENERATOR_CALLED(registered_user_email)
        const hashed_password_generated = await SECURING_PASSCODE(registered_user_email)
        const { recognized_user: new_registered_user_defined, token_for_authentication_generated } = await TRACKING_DATA_OBJECT({ registered_user_email, registered_username, registered_user_password: hashed_password_generated, otp_for_verification: otp_generating_code_block }, RolesSpecified.USER_DESC);

        return response.status(HTTPS_STATUS_CODE.OK).json({
            success: true,
            message_Displayed: SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(AuthTypeDeclared.USER_REGISTRATION, RolesSpecified.USER_DESC),
            userInfo: new_registered_user_defined,
            token: token_for_authentication_generated
        });
    } catch (error_value_displayed) {
        console.error("Error in user registration:", error_value_displayed);
        return response.status(HTTPS_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(AuthTypeDeclared.USER_REGISTRATION).USER_REGISTRATION_SUPPORT
        });
    }
}

export const letting_user_login = async (request: Request<{}, {}, UserLoginRequest>, response: Response) => {
    const { registered_user_email, registered_user_password } = request.body;
    const is_exists_missing_fields = MISSING_FIELDS_VALIDATOR({ registered_user_email, registered_user_password }, response, AuthTypeDeclared.USER_LOGIN);
    if (is_exists_missing_fields) return is_exists_missing_fields;
    const is_existing_database_user = await EXISTING_USER_FOUND_IN_DATABASE(registered_user_email, AuthTypeDeclared.USER_LOGIN, RolesSpecified.USER_DESC)
    return !is_existing_database_user
        ? response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json({ Error: DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE })
        : 'registered_user_password' in is_existing_database_user
            ? await DECODING_INCOMING_SECURITY_PASSCODE(registered_user_email, is_existing_database_user.registered_user_password)
                ? (async () => {
                    const token_for_authentication_generated = await JWT_KEY_GENERATION_ONBOARDED(is_existing_database_user._id)
                    return response.status(HTTPS_STATUS_CODE.OK).json({
                        success: true,
                        message: [
                             
                            { 
                                SUCCESS_MESSAGE : SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(AuthTypeDeclared.USER_LOGIN, RolesSpecified.USER_DESC).SUCCESS_MESSAGE,
                                USER_ROLE: RolesSpecified.USER_DESC ,
                                AUTH_TYPE: AuthTypeDeclared.USER_LOGIN
                            }, 
                            
                        ],
                        userInfo: is_existing_database_user,
                        token: token_for_authentication_generated
                    });
                    
                })()
                : response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json(ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(RolesSpecified.ADMIN_DESC))
            : response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json(ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(RolesSpecified.USER_DESC));

};



export const verify_email_provided_user = async (request: AuthenticatedRequest, response: Response) => {
    try {
        const { otp_for_verification } = request.body;
        if (!otp_for_verification) {
            return response.status(400).json({ Error: "Please provide otp" });
        }
        const stored_token_for_user_request = await OTP_GENERATOR_CALLED(otp_for_verification, request.user.otp_for_verification)

        if (stored_token_for_user_request) {
            request.user.otp_for_verification = "";
            request.user.is_user_verified = true;

            await request.user.save();

            return response.status(200).json({ success: true, message: "Email verified successfully" });
        } else {
            return response.status(400).json({ Error: "Invalid OTP, please try again" });
        }

    } catch (error_value_displayed) {
        console.error(error_value_displayed);
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: (error_value_displayed as Error).message });
    }
}
export const resend_otp_for_verification_request = async (request: AuthenticatedRequest, response: Response) => {
    try {
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user) throw new Error("User not found");

        if (!fetched_loggedin_user.is_user_verified) {
            const redefining_otp_generation = Math.floor(100000 + Math.random() * 900000).toString();
            fetched_loggedin_user.otp_for_verification = redefining_otp_generation;
            await fetched_loggedin_user.save();

            await email_service_enabled({
                senders_email: process.env.SENDER_EMAIL || '',
                receivers_email: fetched_loggedin_user.registered_user_email,
                otp_for_verification: fetched_loggedin_user.otp_for_verification,
                product_by_company: process.env.PRODUCT_NAME || '',
                receivers_username: fetched_loggedin_user.registered_username
            });

            return response.status(200).json({
                success: true,
                message: "OTP sent successfully",
                updated_user_profile_otp: fetched_loggedin_user
            });

        } else {
            return response.status(400).json({ Error: "User already verified" });
        }

    } catch (error_value_displayed) {
        console.error(error_value_displayed);
        return response.status(500).json({
            Error: 'Something went wrong, try again later',
            details: (error_value_displayed as Error).message
        });
    }
}

export const reset_password_for_verified_user = async (request: AuthenticatedRequest, response: Response) => {
    try {
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user) throw new Error();
        if (fetched_loggedin_user.is_user_verified) {
            const { registered_user_password } = request.body;
            const is_same_password_for_user = await bcrypt.compare(registered_user_password, fetched_loggedin_user.registered_user_password)
            if (!is_same_password_for_user) {
                const salted_credentials = await bcrypt.genSalt(10);
                const hashed_password_generated = await bcrypt.hash(registered_user_password, salted_credentials);
                fetched_loggedin_user.registered_user_password = hashed_password_generated;
                await fetched_loggedin_user.save()

                return response.status(200).json({
                    success: true,
                    message: "Password Updated successfully",
                    updated_user_profile_password: fetched_loggedin_user
                });
            }
            else {
                return response.status(400).json({ Error: "Password can't be same as previous password use different one" });
            }

        } else {
            return response.status(400).json({ Error: "Password can't be reset at this moment" });
        }
    } catch (error_value_displayed) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: (error_value_displayed as Error).message });
    }
}
export const get_user_profile = async (request: AuthenticatedRequest, response: Response) => {
    try {
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user) throw new Error(DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE);
        console.log(fetched_loggedin_user)
        return response.status(HTTPS_STATUS_CODE.OK).json({
            success: true,
            message: SUCCESS_VALUES_FETCHER.RETRIEVED_ENTITY_SESSION(RolesSpecified.USER_DESC).SUCCESS_MESSAGE,
            userInfo: fetched_loggedin_user
        })
    } catch (error_value_displayed) {
        return response.status(500).json({ Error: DEFAULT_EXECUTED.ERROR, details: (error_value_displayed as Error).message, NOTFOUND: DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE });
    }
}
