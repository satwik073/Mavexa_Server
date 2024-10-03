import { Request, Response } from "express";
import user_detailed_description from "../../Model/user_model/UserRegisteringModal";
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
import redis from 'redis';
import { promisify } from 'util';
import { email_service_enabled } from "../../Services/EmailServices";
import { EXISTING_USER_FOUND_IN_DATABASE, MISSING_FIELDS_VALIDATOR, TRACKING_DATA_OBJECT } from "../../Middlewares/Error/ErrorHandlerReducer";
import RolesSpecified, { AuthTypeDeclared } from "../../Common/structure";
import { DECODING_INCOMING_SECURITY_PASSCODE, JWT_KEY_GENERATION_ONBOARDED, OTP_GENERATOR_CALLED, SECURING_PASSCODE } from "../../Constants/Functions/CommonFunctions";
import { DEFAULT_EXECUTED, ERROR_VALUES_FETCHER } from "../../Constants/Errors/PreDefinedErrors";
import HTTPS_STATUS_CODE from "http-status-codes";
import { SUCCESS_VALUES_FETCHER } from "../../Constants/Success/PreDefinedSuccess";
import { createClient } from "redis";
import connection_DB_estaiblished from "../../DB/DB/db_config";



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
        const hashed_password_generated = await SECURING_PASSCODE(registered_user_password);

        const { recognized_user: new_registered_user_defined, token_for_authentication_generated } = await TRACKING_DATA_OBJECT({ registered_user_email, registered_username, registered_user_password: hashed_password_generated, otp_for_verification: otp_generating_code_block }, RolesSpecified.USER_DESC);

        return response.status(HTTPS_STATUS_CODE.OK).json({
            success: true,
            message: [
                {
                    SUCCESS_MESSAGE: SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(AuthTypeDeclared.USER_REGISTRATION, RolesSpecified.USER_DESC).SUCCESS_MESSAGE,
                    USER_ROLE: RolesSpecified.USER_DESC,
                    AUTH_TYPE: AuthTypeDeclared.USER_REGISTRATION
                },

            ],
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
export const letting_user_login = async (request: Request, response: Response) => {
    try {
        const { registered_user_email, registered_user_password } = request.body;
        let cachedUserData
        console.log('Received login request for:', registered_user_email);
        const is_exists_missing_fields = MISSING_FIELDS_VALIDATOR(
            { registered_user_email, registered_user_password },
            response,
            AuthTypeDeclared.USER_LOGIN
        );
        if (is_exists_missing_fields) return is_exists_missing_fields;
        try {
            cachedUserData = await request?.redisClient?.get(`user:${registered_user_email}`);
        } catch (err) {
            console.error('Error fetching data from Redis:', err);
        }

        let is_existing_database_user;
        if (cachedUserData) {
            console.log('User data retrieved from Redis cache');
            is_existing_database_user = JSON.parse(cachedUserData);
        } else {
            console.log('No cache found, fetching user data from database');
            is_existing_database_user = await EXISTING_USER_FOUND_IN_DATABASE(
                registered_user_email,
                AuthTypeDeclared.USER_LOGIN,
                RolesSpecified.USER_DESC
            );
            if (is_existing_database_user) {
                try {
                    console.log('Caching user data in Redis');
                    if ('registered_user_email' in is_existing_database_user && 'registered_username' in is_existing_database_user && 'authorities_provided_by_role' in is_existing_database_user && '_id' in is_existing_database_user) {
                        const userDataToCache: any = {
                            id: is_existing_database_user._id,
                            email: is_existing_database_user.registered_user_email,
                            username: is_existing_database_user.registered_username,
                            role: is_existing_database_user.authorities_provided_by_role,
                        };

                        await request?.redisClient?.set(
                            `user:${registered_user_email}`,
                            JSON.stringify(userDataToCache),
                            {
                                EX: 3600
                            }
                        );
                    }

                } catch (err) {
                    console.error('Error setting data in Redis:', err);
                }
            }
        }
        if (!is_existing_database_user) {
            console.log('User not found');
            return response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json({
                Error: DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE
            });
        }
        if ('registered_user_password' in is_existing_database_user) {
            const is_password_valid = await DECODING_INCOMING_SECURITY_PASSCODE(
                registered_user_password,
                is_existing_database_user.registered_user_password
            );

            console.log('Password validation result:', is_password_valid);

            if (is_password_valid) {
                const token_for_authentication_generated = await JWT_KEY_GENERATION_ONBOARDED(is_existing_database_user._id);
                return response.status(HTTPS_STATUS_CODE.OK).json({
                    success: true,
                    message: [{
                        SUCCESS_MESSAGE: SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(AuthTypeDeclared.USER_LOGIN, RolesSpecified.USER_DESC).SUCCESS_MESSAGE,
                        USER_ROLE: RolesSpecified.USER_DESC,
                        AUTH_TYPE: AuthTypeDeclared.USER_LOGIN
                    }],
                    userInfo: is_existing_database_user,
                    token: token_for_authentication_generated
                });
            } else {
                console.log('Invalid password');
                return response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json({
                    Error: ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(RolesSpecified.USER_DESC)
                });
            }
        } else {
            console.log('Password field not found in user data');
        }

        return response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json({
            Error: ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(RolesSpecified.USER_DESC)
        });

    } catch (error: any) {
        console.error('Error in letting_user_login:', error);
        return response.status(HTTPS_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            Error: 'An error occurred during login. Please try again later.',
            Details: error.message
        });
    }
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
        if (!fetched_loggedin_user) throw new Error(DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE);

        if (!fetched_loggedin_user.is_user_verified) {
            const redefining_otp_generation = OTP_GENERATOR_CALLED(request.user.otp_for_verification, request.user.otp_for_verification)
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

        let cachedUserData;
        try {
            cachedUserData = await request?.redisClient?.get(`user:${request.user?.registered_user_email}`);
        } catch (err) {
            console.error('Error fetching data from Redis:', err);
        }

        if (cachedUserData) {
            console.log('User data retrieved from Redis cache');
            return response.status(HTTPS_STATUS_CODE.OK).json({
                success: true,
                message: SUCCESS_VALUES_FETCHER.RETRIEVED_ENTITY_SESSION(RolesSpecified.USER_DESC).SUCCESS_MESSAGE,
                userInfo: JSON.parse(cachedUserData)
            });
        }
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user) {
            throw new Error(DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE);
        }

        console.log('User data fetched from request');
        return response.status(HTTPS_STATUS_CODE.OK).json({
            success: true,
            message: SUCCESS_VALUES_FETCHER.RETRIEVED_ENTITY_SESSION(RolesSpecified.USER_DESC).SUCCESS_MESSAGE,
            userInfo: fetched_loggedin_user
        });

    } catch (error_value_displayed) {
        console.error('Error in get_user_profile:', error_value_displayed);
        return response.status(HTTPS_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            Error: DEFAULT_EXECUTED.ERROR,
            details: (error_value_displayed as Error).message,
            NOTFOUND: DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE
        });
    }
};
