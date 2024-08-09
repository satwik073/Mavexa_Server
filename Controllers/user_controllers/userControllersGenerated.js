"use strict";
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
exports.verify_email_provided_user = exports.letting_user_login = exports.letting_user_registered = void 0;
const UserRegisteringModal_1 = __importDefault(require("../../Model/user_model/UserRegisteringModal"));
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const EmailServices_1 = require("../../Services/EmailServices");
const letting_user_registered = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registered_username, registered_user_email, registered_user_password } = request.body;
        if (!registered_user_email || !registered_user_password || !registered_username) {
            return response.status(400).json({ Error: "All fields are required to register the user" });
        }
        const exisiting_user_found = yield UserRegisteringModal_1.default.findOne({ registered_user_email });
        if (exisiting_user_found) {
            return response.status(400).json({ Error: "User already exists, try registering with a different email" });
        }
        const otp_generating_code_block = Math.floor(100000 + Math.random() * 900000).toString();
        const salted_credentials = yield bcrypt.genSalt(10);
        const hashed_password_generated = yield bcrypt.hash(registered_user_password, salted_credentials);
        const new_registered_user_defined = new UserRegisteringModal_1.default({
            registered_user_email,
            registered_username,
            registered_user_password: hashed_password_generated,
            otp_for_verification: otp_generating_code_block
        });
        yield new_registered_user_defined.save();
        const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
        if (!SECRET_KEY_FETCHED)
            throw new Error("JWT Secret key not defined");
        const token_for_authentication_generated = jwt.sign({ id: new_registered_user_defined._id }, SECRET_KEY_FETCHED, { expiresIn: process.env.JWT_EXPIRY_DATE_ASSIGNED || '30d' });
        yield (0, EmailServices_1.email_service_enabled)({
            senders_email: process.env.SENDER_EMAIL || '',
            recievers_email: new_registered_user_defined.registered_user_email,
            otp_for_verfication: new_registered_user_defined.otp_for_verification,
            product_by_company: process.env.PRODUCT_NAME || '',
            recievers_username: new_registered_user_defined.registered_username
        });
        return response.status(200).json({
            success: true,
            message_Displayed: "User Registered Successfully",
            userInfo: new_registered_user_defined,
            token: token_for_authentication_generated
        });
    }
    catch (error) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: error.message });
    }
});
exports.letting_user_registered = letting_user_registered;
const letting_user_login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registered_user_email, registered_user_password } = request.body;
        if (!registered_user_email || !registered_user_password) {
            return response.status(400).json({ Error: "All fields are required to login" });
        }
        const exisiting_user_found = yield UserRegisteringModal_1.default.findOne({ registered_user_email });
        if (!exisiting_user_found) {
            return response.status(404).json({ Error: "User doesn't exist, try logging in with different credentials" });
        }
        const decoded_password_stored = yield bcrypt.compare(registered_user_password, exisiting_user_found.registered_user_password);
        if (!decoded_password_stored) {
            return response.status(401).json({ Error: "Invalid credentials, try using different ones" });
        }
        const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
        if (!SECRET_KEY_FETCHED)
            throw new Error("JWT Secret key not defined");
        const token_for_authentication_generated = jwt.sign({ id: exisiting_user_found._id }, SECRET_KEY_FETCHED, { expiresIn: process.env.JWT_EXPIRY_DATE_ASSIGNED || '30d' });
        return response.status(200).json({
            success: true,
            message: "User logged in successfully",
            userInfo: exisiting_user_found,
            token: token_for_authentication_generated
        });
    }
    catch (error) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: error.message });
    }
});
exports.letting_user_login = letting_user_login;
const verify_email_provided_user = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp_for_verification } = request.body;
        if (!otp_for_verification) {
            return response.status(400).json({ Error: "Please provide otp" });
        }
        const stored_token_for_user_request = request.user.otp_for_verification;
        if (stored_token_for_user_request) {
            if (+otp_for_verification === +stored_token_for_user_request) {
                request.user.otp_for_verification = "";
                request.user.is_user_verified = true;
                yield request.user.save();
                return response.status(200).json({ success: true, message: "Email verified successfully" });
            }
            else {
                return response.status(400).json({ Error: "Invalid OTP, please try again" });
            }
        }
        else {
            return response.status(400).json({ Error: "No OTP found for user, please request a new one" });
        }
    }
    catch (error_value_displayed) {
        console.error(error_value_displayed);
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: error_value_displayed.message });
    }
});
exports.verify_email_provided_user = verify_email_provided_user;
