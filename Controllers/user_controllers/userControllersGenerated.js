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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_user_profile = exports.reset_password_for_verified_user = exports.resend_otp_for_verification_request = exports.verify_email_provided_user = exports.letting_user_login = exports.letting_user_registered = void 0;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const EmailServices_1 = require("../../Services/EmailServices");
const ErrorHandlerReducer_1 = require("../../Middlewares/Error/ErrorHandlerReducer");
const structure_1 = __importStar(require("../../Common/structure"));
const CommonFunctions_1 = require("../../Constants/Functions/CommonFunctions");
const PreDefinedErrors_1 = require("../../Constants/Errors/PreDefinedErrors");
const server_1 = require("../../server");
const PreDefinedSuccess_1 = require("../../Constants/Success/PreDefinedSuccess");
const letting_user_registered = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { registered_username, registered_user_email, registered_user_password } = request.body;
    const is_exists_missing_fields = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ registered_user_email, registered_user_password, registered_username }, response, structure_1.AuthTypeDeclared.USER_REGISTRATION);
    if (is_exists_missing_fields)
        return is_exists_missing_fields;
    yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)(registered_user_email, structure_1.AuthTypeDeclared.USER_REGISTRATION, structure_1.default.USER_DESC);
    const otp_generating_code_block = yield (0, CommonFunctions_1.OTP_GENERATOR_CALLED)(registered_user_email);
    const hashed_password_generated = yield (0, CommonFunctions_1.SECURING_PASSCODE)(registered_user_email);
    const { recognized_user: new_registered_user_defined, token_for_authentication_generated } = yield (0, ErrorHandlerReducer_1.TRACKING_DATA_OBJECT)({ registered_user_email, registered_username, registered_user_password: hashed_password_generated, otp_for_verification: otp_generating_code_block }, structure_1.default.USER_DESC);
    return response.status(server_1.HTTPS_STATUS_CODE.OK).json({
        success: true,
        message_Displayed: PreDefinedSuccess_1.SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(structure_1.AuthTypeDeclared.USER_REGISTRATION, structure_1.default.USER_DESC),
        userInfo: new_registered_user_defined,
        token: token_for_authentication_generated
    });
});
exports.letting_user_registered = letting_user_registered;
const letting_user_login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { registered_user_email, registered_user_password } = request.body;
    const is_exists_missing_fields = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ registered_user_password, registered_user_email }, response, structure_1.AuthTypeDeclared.USER_LOGIN);
    if (is_exists_missing_fields)
        return is_exists_missing_fields;
    const exisiting_user_found = yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)(registered_user_email, structure_1.AuthTypeDeclared.USER_LOGIN, structure_1.default.USER_DESC);
    return !exisiting_user_found
        ? response.status(404).json(PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER)
        : 'registered_user_password' in exisiting_user_found
            ? (yield (0, CommonFunctions_1.DECODING_INCOMING_SECURITY_PASSCODE)(registered_user_password, exisiting_user_found.registered_user_password))
                ? (() => {
                    const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
                    if (!SECRET_KEY_FETCHED)
                        return response.status(400).json((PreDefinedErrors_1.ERROR_VALUES_FETCHER.JWT_DETECTED_ERRORS));
                    const token_for_authentication_generated = jwt.sign({ id: exisiting_user_found._id }, SECRET_KEY_FETCHED, { expiresIn: process.env.JWT_EXPIRY_DATE_ASSIGNED || '30d' });
                    return response.status(server_1.HTTPS_STATUS_CODE.OK).json({
                        success: true,
                        message: "User logged in successfully",
                        userInfo: exisiting_user_found,
                        token: token_for_authentication_generated
                    });
                })()
                : response.status(server_1.HTTPS_STATUS_CODE.UNAUTHORIZED).json(PreDefinedErrors_1.ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(structure_1.default.USER_DESC))
            : response.status(server_1.HTTPS_STATUS_CODE.UNAUTHORIZED).json(PreDefinedErrors_1.ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(structure_1.default.ADMIN_DESC));
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
            throw new Error("User not found");
        if (!fetched_loggedin_user.is_user_verified) {
            const redefining_otp_generation = Math.floor(100000 + Math.random() * 900000).toString();
            fetched_loggedin_user.otp_for_verification = redefining_otp_generation;
            yield fetched_loggedin_user.save();
            yield (0, EmailServices_1.email_service_enabled)({
                senders_email: process.env.SENDER_EMAIL || '',
                recievers_email: fetched_loggedin_user.registered_user_email,
                otp_for_verfication: fetched_loggedin_user.otp_for_verification,
                product_by_company: process.env.PRODUCT_NAME || '',
                recievers_username: fetched_loggedin_user.registered_username
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
    try {
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user)
            throw new Error("User Can't found");
        console.log(fetched_loggedin_user);
        return response.status(200).json({
            success: true,
            message: "User Fetched successfuly",
            userInfo: fetched_loggedin_user
        });
    }
    catch (error_value_displayed) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: error_value_displayed.message });
    }
});
exports.get_user_profile = get_user_profile;
//# sourceMappingURL=userControllersGenerated.js.map