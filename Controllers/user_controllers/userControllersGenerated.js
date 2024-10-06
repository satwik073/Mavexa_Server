"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_user_profile = exports.reset_password_for_verified_user = exports.resend_otp_for_verification_request = exports.verify_email_provided_user = exports.letting_user_login = exports.letting_user_registered = void 0;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const EmailServices_1 = require("../../Services/EmailServices");
const ErrorHandlerReducer_1 = require("../../Middlewares/Error/ErrorHandlerReducer");
const structure_1 = __importStar(require("../../Common/structure"));
const CommonFunctions_1 = require("../../Constants/Functions/CommonFunctions");
const PreDefinedErrors_1 = require("../../Constants/Errors/PreDefinedErrors");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const PreDefinedSuccess_1 = require("../../Constants/Success/PreDefinedSuccess");
const letting_user_registered = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registered_username, registered_user_email, registered_user_password } = request.body;
        const is_exists_missing_fields = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ registered_user_email, registered_user_password, registered_username }, response, structure_1.AuthTypeDeclared.USER_REGISTRATION);
        if (is_exists_missing_fields)
            return is_exists_missing_fields;
        yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)(registered_user_email, structure_1.AuthTypeDeclared.USER_REGISTRATION, structure_1.default.USER_DESC);
        const otp_generating_code_block = yield (0, CommonFunctions_1.OTP_GENERATOR_CALLED)(registered_user_email);
        const hashed_password_generated = yield (0, CommonFunctions_1.SECURING_PASSCODE)(registered_user_password);
        const { recognized_user: new_registered_user_defined, token_for_authentication_generated } = yield (0, ErrorHandlerReducer_1.TRACKING_DATA_OBJECT)({ registered_user_email, registered_username, registered_user_password: hashed_password_generated, otp_for_verification: otp_generating_code_block }, structure_1.default.USER_DESC);
        return response.status(http_status_codes_1.default.OK).json({
            success: true,
            message: [
                {
                    SUCCESS_MESSAGE: PreDefinedSuccess_1.SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(structure_1.AuthTypeDeclared.USER_REGISTRATION, structure_1.default.USER_DESC).SUCCESS_MESSAGE,
                    USER_ROLE: structure_1.default.USER_DESC,
                    AUTH_TYPE: structure_1.AuthTypeDeclared.USER_REGISTRATION
                },
            ],
            userInfo: new_registered_user_defined,
            token: token_for_authentication_generated
        });
    }
    catch (error_value_displayed) {
        console.error("Error in user registration:", error_value_displayed);
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: PreDefinedErrors_1.ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(structure_1.AuthTypeDeclared.USER_REGISTRATION).USER_REGISTRATION_SUPPORT
        });
    }
});
exports.letting_user_registered = letting_user_registered;
const letting_user_login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { registered_user_email, registered_user_password } = request.body;
        let cachedUserData;
        const is_exists_missing_fields = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ registered_user_email, registered_user_password }, response, structure_1.AuthTypeDeclared.USER_LOGIN);
        if (is_exists_missing_fields)
            return is_exists_missing_fields;
        try {
            cachedUserData = yield ((_a = request === null || request === void 0 ? void 0 : request.redisClient) === null || _a === void 0 ? void 0 : _a.get(`user:${registered_user_email}`));
        }
        catch (err) {
            console.error('Error fetching data from Redis:', err);
        }
        let is_existing_database_user;
        if (cachedUserData) {
            console.log('User data retrieved from Redis cache');
            is_existing_database_user = JSON.parse(cachedUserData);
        }
        else {
            console.log('No cache found, fetching user data from database');
            is_existing_database_user = yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)(registered_user_email, structure_1.AuthTypeDeclared.USER_LOGIN, structure_1.default.USER_DESC);
            console.log(is_existing_database_user);
            if (is_existing_database_user) {
                try {
                    console.log('Caching user data in Redis');
                    if ('registered_user_email' in is_existing_database_user &&
                        'registered_user_password' in is_existing_database_user &&
                        'registered_username' in is_existing_database_user &&
                        'authorities_provided_by_role' in is_existing_database_user &&
                        '_id' in is_existing_database_user) {
                        const userDataToCache = {
                            id: is_existing_database_user._id,
                            email: is_existing_database_user.registered_user_email,
                            username: is_existing_database_user.registered_username,
                            password: is_existing_database_user.registered_user_password,
                            verified: is_existing_database_user.is_user_verified,
                            role: is_existing_database_user.authorities_provided_by_role,
                        };
                        yield ((_b = request === null || request === void 0 ? void 0 : request.redisClient) === null || _b === void 0 ? void 0 : _b.set(`user:${registered_user_email}`, JSON.stringify(userDataToCache)));
                    }
                }
                catch (err) {
                    console.error('Error setting data in Redis:', err);
                }
            }
            else {
                console.log('User not found in database');
                return response.status(http_status_codes_1.default.UNAUTHORIZED).json({
                    Error: PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER(structure_1.default.USER_DESC).MESSAGE
                });
            }
        }
        console.log("User data:", is_existing_database_user);
        if (is_existing_database_user && cachedUserData) {
            const is_password_valid = yield (0, CommonFunctions_1.DECODING_INCOMING_SECURITY_PASSCODE)(registered_user_password, is_existing_database_user.password);
            console.log('Password validation result:', is_password_valid);
            if (is_password_valid) {
                const token_for_authentication_generated = yield (0, CommonFunctions_1.JWT_KEY_GENERATION_ONBOARDED)(is_existing_database_user._id);
                return response.status(http_status_codes_1.default.OK).json({
                    success: true,
                    message: [{
                            SUCCESS_MESSAGE: PreDefinedSuccess_1.SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(structure_1.AuthTypeDeclared.USER_LOGIN, structure_1.default.USER_DESC).SUCCESS_MESSAGE,
                            USER_ROLE: structure_1.default.USER_DESC,
                            AUTH_TYPE: structure_1.AuthTypeDeclared.USER_LOGIN
                        }],
                    userInfo: is_existing_database_user,
                    token: token_for_authentication_generated
                });
            }
            else {
                console.log('Invalid password');
                return response.status(http_status_codes_1.default.UNAUTHORIZED).json({
                    Error: PreDefinedErrors_1.ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(structure_1.default.USER_DESC)
                });
            }
        }
        else if (is_existing_database_user && !cachedUserData) {
            const is_password_valid = yield (0, CommonFunctions_1.DECODING_INCOMING_SECURITY_PASSCODE)(registered_user_password, is_existing_database_user.registered_user_password);
            console.log('Password validation result:', is_password_valid);
            if (is_password_valid) {
                const token_for_authentication_generated = yield (0, CommonFunctions_1.JWT_KEY_GENERATION_ONBOARDED)(is_existing_database_user._id);
                return response.status(http_status_codes_1.default.OK).json({
                    success: true,
                    message: [{
                            SUCCESS_MESSAGE: PreDefinedSuccess_1.SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(structure_1.AuthTypeDeclared.USER_LOGIN, structure_1.default.USER_DESC).SUCCESS_MESSAGE,
                            USER_ROLE: structure_1.default.USER_DESC,
                            AUTH_TYPE: structure_1.AuthTypeDeclared.USER_LOGIN
                        }],
                    userInfo: is_existing_database_user,
                    token: token_for_authentication_generated
                });
            }
            else {
                console.log('Invalid password');
                return response.status(http_status_codes_1.default.UNAUTHORIZED).json({
                    Error: PreDefinedErrors_1.ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(structure_1.default.USER_DESC)
                });
            }
        }
        else {
            console.log('Password field not found in user data');
        }
        return response.status(http_status_codes_1.default.UNAUTHORIZED).json({
            Error: PreDefinedErrors_1.ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(structure_1.default.USER_DESC)
        });
    }
    catch (error) {
        console.error('Error in letting_user_login:', error);
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            Error: 'An error occurred during login. Please try again later.',
            Details: error.message
        });
    }
});
exports.letting_user_login = letting_user_login;
const verify_email_provided_user = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp_for_verification } = request.body;
        if (!otp_for_verification) {
            return response.status(400).json({ Error: "Please provide otp" });
        }
        const stored_token_for_user_request = yield (0, CommonFunctions_1.OTP_GENERATOR_CALLED)(otp_for_verification, request.user.otp_for_verification);
        if (stored_token_for_user_request) {
            request.user.otp_for_verification = "";
            request.user.is_user_verified = true;
            yield request.user.save();
            return response.status(200).json({ success: true, message: "Email verified successfully" });
        }
        else {
            return response.status(400).json({ Error: "Invalid OTP, please try again" });
        }
    }
    catch (error_value_displayed) {
        console.error(error_value_displayed);
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: error_value_displayed.message });
    }
});
exports.verify_email_provided_user = verify_email_provided_user;
const resend_otp_for_verification_request = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user)
            throw new Error(PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER(structure_1.default.USER_DESC).MESSAGE);
        if (!fetched_loggedin_user.is_user_verified) {
            const redefining_otp_generation = (0, CommonFunctions_1.OTP_GENERATOR_CALLED)(request.user.otp_for_verification, request.user.otp_for_verification);
            fetched_loggedin_user.otp_for_verification = redefining_otp_generation;
            yield fetched_loggedin_user.save();
            yield (0, EmailServices_1.email_service_enabled)({
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
        }
        else {
            return response.status(400).json({ Error: "User already verified" });
        }
    }
    catch (error_value_displayed) {
        console.error(error_value_displayed);
        return response.status(500).json({
            Error: 'Something went wrong, try again later',
            details: error_value_displayed.message
        });
    }
});
exports.resend_otp_for_verification_request = resend_otp_for_verification_request;
const reset_password_for_verified_user = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user)
            throw new Error();
        if (fetched_loggedin_user.is_user_verified) {
            const { registered_user_password } = request.body;
            const is_same_password_for_user = yield bcrypt.compare(registered_user_password, fetched_loggedin_user.registered_user_password);
            if (!is_same_password_for_user) {
                const salted_credentials = yield bcrypt.genSalt(10);
                const hashed_password_generated = yield bcrypt.hash(registered_user_password, salted_credentials);
                fetched_loggedin_user.registered_user_password = hashed_password_generated;
                yield fetched_loggedin_user.save();
                return response.status(200).json({
                    success: true,
                    message: "Password Updated successfully",
                    updated_user_profile_password: fetched_loggedin_user
                });
            }
            else {
                return response.status(400).json({ Error: "Password can't be same as previous password use different one" });
            }
        }
        else {
            return response.status(400).json({ Error: "Password can't be reset at this moment" });
        }
    }
    catch (error_value_displayed) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: error_value_displayed.message });
    }
});
exports.reset_password_for_verified_user = reset_password_for_verified_user;
const get_user_profile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let cachedUserData;
        try {
            cachedUserData = yield ((_a = request === null || request === void 0 ? void 0 : request.redisClient) === null || _a === void 0 ? void 0 : _a.get(`user:${(_b = request.user) === null || _b === void 0 ? void 0 : _b.registered_user_email}`));
        }
        catch (err) {
            console.error('Error fetching data from Redis:', err);
        }
        if (cachedUserData) {
            console.log('User data retrieved from Redis cache');
            return response.status(http_status_codes_1.default.OK).json({
                success: true,
                message: PreDefinedSuccess_1.SUCCESS_VALUES_FETCHER.RETRIEVED_ENTITY_SESSION(structure_1.default.USER_DESC).SUCCESS_MESSAGE,
                userInfo: JSON.parse(cachedUserData)
            });
        }
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user) {
            throw new Error(PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER(structure_1.default.USER_DESC).MESSAGE);
        }
        console.log('User data fetched from request');
        return response.status(http_status_codes_1.default.OK).json({
            success: true,
            message: PreDefinedSuccess_1.SUCCESS_VALUES_FETCHER.RETRIEVED_ENTITY_SESSION(structure_1.default.USER_DESC).SUCCESS_MESSAGE,
            userInfo: fetched_loggedin_user
        });
    }
    catch (error_value_displayed) {
        console.error('Error in get_user_profile:', error_value_displayed);
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            Error: PreDefinedErrors_1.DEFAULT_EXECUTED.ERROR,
            details: error_value_displayed.message,
            NOTFOUND: PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER(structure_1.default.USER_DESC).MESSAGE
        });
    }
});
exports.get_user_profile = get_user_profile;
//# sourceMappingURL=userControllersGenerated.js.map