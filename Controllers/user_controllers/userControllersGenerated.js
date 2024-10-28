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
exports.reset_password_for_verified_user = exports.resend_otp_for_verification_request = exports.verify_email_provided_user = exports.get_user_profile = exports.letting_user_login = exports.UserAuthPersist = exports.letting_user_registered = exports.UserRegistrationProcess = void 0;
const bcrypt = require('bcryptjs');
const EmailServices_1 = require("../../Services/EmailServices");
const ErrorHandlerReducer_1 = require("../../Middlewares/Error/ErrorHandlerReducer");
const structure_1 = __importStar(require("../../Common/structure"));
const CommonFunctions_1 = require("../../Constants/Functions/CommonFunctions");
const PreDefinedErrors_1 = require("../../Constants/Errors/PreDefinedErrors");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const PreDefinedSuccess_1 = require("../../Constants/Success/PreDefinedSuccess");
const RedisConfigurations_1 = require("../../Database/RedisCacheDB/RedisConfigurations");
const CacheUtils_1 = require("../../Database/RedisCacheDB/CacheUtils");
// Example usage
// const deleteCache = async () => {
//     try {
//         const result = await request?.redisClient?.del(`user:${registered_user_email}`);
//         console.log(`Deleted ${result} key(s) from cache`);
//     } catch (err) {
//         console.error('Error deleting key:', err);
//     }
// };
// deleteCache()
exports.UserRegistrationProcess = (0, ErrorHandlerReducer_1.ASYNC_ERROR_HANDLER_ESTAIBLISHED)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { registered_username, registered_user_email, registered_user_password } = request.body;
    const missingFields = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ registered_user_email, registered_user_password }, response, structure_1.AuthTypeDeclared.USER_REGISTRATION);
    if (missingFields)
        return missingFields;
    yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)(registered_user_email, structure_1.AuthTypeDeclared.USER_REGISTRATION, structure_1.default.USER_DESC);
    const otpCaptured = (0, CommonFunctions_1.OTP_GENERATOR_CALLED)(registered_user_email);
    const manipulatedPasscode = (0, CommonFunctions_1.SECURING_PASSCODE)(registered_user_password);
    const { recognized_user: userRegistrationData, token_for_authentication_generated: tokenFetched } = yield (0, ErrorHandlerReducer_1.TRACKING_DATA_OBJECT)({
        registered_user_email,
        registered_username,
        registered_user_password: manipulatedPasscode,
        otp_for_verification: otpCaptured
    }, structure_1.default.USER_DESC);
    const cacheKey = `user:${userRegistrationData.id}`;
    try {
        yield (0, CacheUtils_1.setCacheWithAdvancedTTLHandlingAndPipelining)(cacheKey, userRegistrationData, 3600);
    }
    catch (redisError) {
        console.error('Failed to store user registration data in Redis:', redisError);
    }
    return response.status(http_status_codes_1.default.OK).json({
        success: true,
        message: [
            {
                SUCCESS_MESSAGE: PreDefinedSuccess_1.SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(structure_1.AuthTypeDeclared.USER_REGISTRATION, structure_1.default.USER_DESC).SUCCESS_MESSAGE,
                USER_ROLE: structure_1.default.USER_DESC,
                AUTH_TYPE: structure_1.AuthTypeDeclared.USER_REGISTRATION
            },
        ],
        userInfo: userRegistrationData,
        token: tokenFetched
    });
}));
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
        console.log(new_registered_user_defined.id);
        const cacheKey = `user:${new_registered_user_defined.id}`;
        try {
            (0, CacheUtils_1.setCacheWithAdvancedTTLHandlingAndPipelining)(cacheKey, new_registered_user_defined, 3600);
        }
        catch (redisError) {
            console.error('Failed to store user registration data in Redis:', redisError);
        }
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
const UserAuthPersist = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registered_user_email, registered_user_password } = request.body;
        const missingAttributes = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ registered_user_email, registered_user_password }, response, structure_1.AuthTypeDeclared.USER_LOGIN);
        if (missingAttributes)
            return missingAttributes;
        let userDataCaptured;
        try {
            userDataCaptured = yield (RedisConfigurations_1.redisClusterConnection === null || RedisConfigurations_1.redisClusterConnection === void 0 ? void 0 : RedisConfigurations_1.redisClusterConnection.get(`user:${registered_user_email}`));
            if (userDataCaptured) {
                userDataCaptured = JSON.parse(userDataCaptured);
                const passwordValid = yield (0, CommonFunctions_1.DECODING_INCOMING_SECURITY_PASSCODE)(registered_user_password, userDataCaptured.password);
                if (passwordValid) {
                    const tokenProvider = yield (0, CommonFunctions_1.JWT_KEY_GENERATION_ONBOARDED)(userDataCaptured._id);
                    return response.status(http_status_codes_1.default.OK).json({
                        success: true,
                        userInfo: userDataCaptured,
                        token: tokenProvider
                    });
                }
                else {
                    return response.status(http_status_codes_1.default.UNAUTHORIZED).json({
                        success: false,
                        message: "Invalid email or password"
                    });
                }
            }
            else {
                const trackingUser = yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)(registered_user_email, structure_1.AuthTypeDeclared.USER_LOGIN, structure_1.default.USER_DESC);
                // Define a type guard function to check if trackingUser is of type UserDocument
                function isUserDocument(user) {
                    return ('registered_user_email' in user &&
                        'registered_user_password' in user &&
                        'registered_username' in user &&
                        'authorities_provided_by_role' in user &&
                        '_id' in user);
                }
                if (trackingUser && isUserDocument(trackingUser)) {
                    const dataSentToRedis = {
                        _id: trackingUser._id,
                        email: trackingUser.registered_user_email,
                        username: trackingUser.registered_username,
                        password: trackingUser.registered_user_password,
                        otpVerification: trackingUser === null || trackingUser === void 0 ? void 0 : trackingUser.otp_for_verification,
                        verified: trackingUser.is_user_verified,
                        role: trackingUser.authorities_provided_by_role,
                    };
                    yield (RedisConfigurations_1.redisClusterConnection === null || RedisConfigurations_1.redisClusterConnection === void 0 ? void 0 : RedisConfigurations_1.redisClusterConnection.set(`user:${registered_user_email}`, JSON.stringify(dataSentToRedis), 'EX', 3600));
                    const passcodeValid = yield (0, CommonFunctions_1.DECODING_INCOMING_SECURITY_PASSCODE)(registered_user_password, trackingUser.registered_user_password);
                    if (passcodeValid) {
                        const token = yield (0, CommonFunctions_1.JWT_KEY_GENERATION_ONBOARDED)(trackingUser._id);
                        return response.status(http_status_codes_1.default.OK).json({
                            success: true,
                            userInfo: trackingUser,
                            token: token,
                        });
                    }
                    else {
                        return response.status(http_status_codes_1.default.UNAUTHORIZED).json({
                            success: false,
                            message: "Invalid email or password",
                        });
                    }
                }
                else {
                    return response.status(http_status_codes_1.default.NOT_FOUND).json({
                        success: false,
                        message: "User not found"
                    });
                }
            }
        }
        catch (err) {
            console.error("Internal error:", err);
            return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An internal error occurred while processing the request"
            });
        }
    }
    catch (err) {
        console.error("Unexpected error:", err);
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "An unexpected error occurred"
        });
    }
});
exports.UserAuthPersist = UserAuthPersist;
const letting_user_login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Redis pipeline type:", typeof RedisConfigurations_1.redisClusterConnection.pipeline); // Should log 'function'
        const { registered_user_email, registered_user_password } = request.body;
        let cachedUserData;
        // Validate required fields
        const is_exists_missing_fields = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ registered_user_email, registered_user_password }, response, structure_1.AuthTypeDeclared.USER_LOGIN);
        if (is_exists_missing_fields)
            return is_exists_missing_fields;
        // Check Redis cache for user data
        try {
            console.log(`Checking Redis for user data: user:${registered_user_email}`);
            cachedUserData = yield RedisConfigurations_1.redisClusterConnection.get(`user:${registered_user_email}`);
            console.log("Redis data retrieved:", cachedUserData);
        }
        catch (err) {
            console.error('Error fetching data from Redis:', err);
        }
        let is_existing_database_user;
        // Use cached data if available, otherwise retrieve from MongoDB
        if (cachedUserData) {
            console.log('User data found in Redis cache');
            is_existing_database_user = JSON.parse(cachedUserData);
        }
        else {
            console.log('No cache found, querying MongoDB for user data');
            is_existing_database_user = yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)(registered_user_email, structure_1.AuthTypeDeclared.USER_LOGIN, structure_1.default.USER_DESC);
            console.log("MongoDB data retrieved:", is_existing_database_user);
            // Cache the MongoDB user data in Redis
            if (is_existing_database_user) {
                try {
                    console.log('Caching user data in Redis');
                    const userDataToCache = {
                        id: is_existing_database_user._id,
                        email: is_existing_database_user.registered_user_email,
                        username: is_existing_database_user.registered_username,
                        password: is_existing_database_user.registered_user_password,
                        verified: is_existing_database_user.is_user_verified,
                        role: is_existing_database_user.authorities_provided_by_role,
                    };
                    yield RedisConfigurations_1.redisClusterConnection.set(`user:${registered_user_email}`, JSON.stringify(userDataToCache), 'EX', 3600 // TTL of 1 hour
                    );
                }
                catch (err) {
                    console.error('Error setting data in Redis:', err);
                }
            }
            else {
                console.log('User not found in MongoDB');
                return response.status(http_status_codes_1.default.UNAUTHORIZED).json({
                    Error: PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER(structure_1.default.USER_DESC).MESSAGE
                });
            }
        }
        console.log("User data for validation:", is_existing_database_user);
        // Password validation logic
        const is_password_valid = yield (0, CommonFunctions_1.DECODING_INCOMING_SECURITY_PASSCODE)(registered_user_password, is_existing_database_user.password || is_existing_database_user.registered_user_password);
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
    catch (error) {
        console.error('Error in letting_user_login:', error);
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            Error: 'An error occurred during login. Please try again later.',
            Details: error.message
        });
    }
});
exports.letting_user_login = letting_user_login;
const get_user_profile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        console.log("Function get_user_profile called");
        console.log("User email from request:", (_a = request.user) === null || _a === void 0 ? void 0 : _a.registered_user_email);
        let cachedUserData = yield RedisConfigurations_1.redisClusterConnection.get(`user:${(_b = request.user) === null || _b === void 0 ? void 0 : _b.registered_user_email}`);
        if (cachedUserData) {
            return response.status(http_status_codes_1.default.OK).json({
                success: true,
                userInfo: JSON.parse(cachedUserData),
            });
        }
        else {
            const userDataCaptured = yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)((_c = request === null || request === void 0 ? void 0 : request.user) === null || _c === void 0 ? void 0 : _c.registered_user_email, structure_1.AuthTypeDeclared.USER_LOGIN, structure_1.default.USER_DESC);
            if (userDataCaptured) {
                return response.status(http_status_codes_1.default.OK).json({
                    success: true,
                    userInfo: userDataCaptured,
                });
            }
        }
        // if ( cachedUserData){
        //     return response.status(HTTPS_STATUS_CODE.NOT_FOUND).json({
        //         // success: false,
        //         message: DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE
        //     });
        // }
        // else {
        //     const fetched_loggedin_user = request.user;
        //     console.log("Fallback to user data from request:", fetched_loggedin_user);
        //     if (!fetched_loggedin_user) {
        //         throw new Error(DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE);
        //     }
        //     console.log("Returning user data from request");
        //     return response.status(HTTPS_STATUS_CODE.OK).json({
        //         success: true,
        //         message: SUCCESS_VALUES_FETCHER.RETRIEVED_ENTITY_SESSION(RolesSpecified.USER_DESC).SUCCESS_MESSAGE,
        //         userInfo: fetched_loggedin_user
        //     });
        // }
        // try {
        //     console.log("Attempting to fetch data from Redis...");
        //     cachedUserData = 
        //     console.log("Fetched data from Redis:", cachedUserData);
        // } catch (err) {
        //     console.error('Error fetching data from Redis:', err);
        // }
        console.log("Checking Redis data...");
        // if (cachedUserData) {
        //     console.log("Redis data exists, parsing...");
        //     const parsedData = JSON.parse(cachedUserData);
        //     if (parsedData === null || parsedData === "user not found") {
        //         console.log('User not found in Redis cache');
        //         return response.status(HTTPS_STATUS_CODE.NOT_FOUND).json({
        //             success: false,
        //             message: DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE
        //         });
        //     }
        //     console.log('User data retrieved from Redis cache:', parsedData);
        //     return response.status(HTTPS_STATUS_CODE.OK).json({
        //         success: true,
        //         message: SUCCESS_VALUES_FETCHER.RETRIEVED_ENTITY_SESSION(RolesSpecified.USER_DESC).SUCCESS_MESSAGE,
        //         userInfo: parsedData
        //     });
        // }
        // Fallback if Redis does not contain user data
    }
    catch (error_value_displayed) {
        console.log("hi");
        console.error('Error in get_user_profile:', error_value_displayed);
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            Error: PreDefinedErrors_1.DEFAULT_EXECUTED.ERROR,
            details: error_value_displayed.message,
            // NOTFOUND: DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE
        });
    }
});
exports.get_user_profile = get_user_profile;
const verify_email_provided_user = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { otp_for_verification } = request.body;
        const missingAttributes = yield (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ otp_for_verification }, response, structure_1.AuthTypeDeclared.USER_LOGIN);
        if (missingAttributes)
            return missingAttributes;
        const cachedUserData = yield RedisConfigurations_1.redisClusterConnection.get(`user:${(_a = request.user) === null || _a === void 0 ? void 0 : _a.registered_user_email}`);
        const parsedData = cachedUserData ? JSON.parse(cachedUserData) : null;
        // Validate OTP based on cached or direct user data
        const userOtp = parsedData ? parsedData.otpVerification : (_b = request.user) === null || _b === void 0 ? void 0 : _b.otp_for_verification;
        const OTPValidator = yield (0, CommonFunctions_1.OTP_VALIDATOR_SETTLE)(otp_for_verification, userOtp);
        console.log("this", OTPValidator);
        if (OTPValidator) {
            // Update the verification status in Redis
            const updatedUserData = Object.assign(Object.assign({}, parsedData), { otpVerification: otp_for_verification, verified: true });
            request.user.otp_for_verification = "";
            request.user.is_user_verified = true;
            yield ((_c = request === null || request === void 0 ? void 0 : request.user) === null || _c === void 0 ? void 0 : _c.save());
            yield RedisConfigurations_1.redisClusterConnection.set(`user:${(_d = request.user) === null || _d === void 0 ? void 0 : _d.registered_user_email}`, JSON.stringify(updatedUserData));
            return response.status(200).json({ success: true, message: "Email verified successfully" });
        }
        else {
            return response.status(400).json({ success: false, message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.error("Error during email verification:", error);
        return response.status(500).json({ success: false, message: 'Something went wrong, try again later', details: error.message });
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
//# sourceMappingURL=userControllersGenerated.js.map