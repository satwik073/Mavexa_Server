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
exports.MODIFIED_STATE_SETTER = exports.JWT_KEY_GENERATION_ONBOARDED = exports.OTP_VALIDATOR_SETTLE = exports.DECODING_INCOMING_SECURITY_PASSCODE = exports.SECURING_PASSCODE = exports.OTP_GENERATOR_CALLED = void 0;
const PreDefinedErrors_1 = require("../Errors/PreDefinedErrors");
const structure_1 = __importDefault(require("../../Common/structure"));
const AdminDataModel_1 = __importDefault(require("../../Model/admin_model/AdminDataModel"));
const UserRegisteringModal_1 = __importDefault(require("../../Model/user_model/UserRegisteringModal"));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const OTP_GENERATOR_CALLED = (entered_password_registration, otp_for_verification) => __awaiter(void 0, void 0, void 0, function* () {
    return Math.floor(100000 + Math.random() * 900000).toString();
});
exports.OTP_GENERATOR_CALLED = OTP_GENERATOR_CALLED;
const SECURING_PASSCODE = (entered_password_registration) => __awaiter(void 0, void 0, void 0, function* () {
    const salted_credentials = yield bcrypt.genSalt(10);
    console.log("Salt generated during registration:", salted_credentials);
    const hashed_password = yield bcrypt.hash(entered_password_registration, salted_credentials);
    console.log("Hashed password:", hashed_password);
    return hashed_password;
});
exports.SECURING_PASSCODE = SECURING_PASSCODE;
const DECODING_INCOMING_SECURITY_PASSCODE = (user_entered_password, user_registered_password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(user_entered_password, user_registered_password);
});
exports.DECODING_INCOMING_SECURITY_PASSCODE = DECODING_INCOMING_SECURITY_PASSCODE;
const OTP_VALIDATOR_SETTLE = (user_entered_otp_request, software_generated_otp_request) => __awaiter(void 0, void 0, void 0, function* () {
    return (+user_entered_otp_request === +software_generated_otp_request) ? true : false;
});
exports.OTP_VALIDATOR_SETTLE = OTP_VALIDATOR_SETTLE;
const JWT_KEY_GENERATION_ONBOARDED = (user_generated_id) => __awaiter(void 0, void 0, void 0, function* () {
    const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
    if (!SECRET_KEY_FETCHED)
        throw new Error(PreDefinedErrors_1.ERROR_VALUES_FETCHER.JWT_DETECTED_ERRORS.JWT_NOT_DETECTED);
    return jwt.sign({ id: user_generated_id }, SECRET_KEY_FETCHED, { expiresIn: process.env.JWT_EXPIRY_DATE_ASSIGNED || '30d' });
});
exports.JWT_KEY_GENERATION_ONBOARDED = JWT_KEY_GENERATION_ONBOARDED;
const MODIFIED_STATE_SETTER = (user_auth_type_specified, request, user_registered_email, user_entered_password, user_entered_otp_request, user_entered_userName, admin_user_email, admin_userPassword, admin_userName, is_user_verified) => __awaiter(void 0, void 0, void 0, function* () {
    const payload_requested = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (user_registered_email ? { user_registered_email } : {})), (user_entered_password ? { user_entered_password } : {})), (user_entered_otp_request ? { user_entered_otp_request } : {})), (user_entered_userName ? { user_entered_userName } : {})), (admin_user_email ? { admin_user_email } : {})), (admin_userPassword ? { admin_userPassword } : {})), (admin_userName ? { admin_userName } : {})), (is_user_verified ? { is_user_verified } : {}));
    let save_payload_properties = {};
    if (user_auth_type_specified === structure_1.default.ADMIN_DESC) {
        save_payload_properties = Object.assign(Object.assign(Object.assign({}, (payload_requested.admin_userEmail ? { admin_userEmail: payload_requested.admin_userEmail } : {})), (payload_requested.admin_userPassword ? { admin_userPassword: payload_requested.admin_userPassword } : {})), (payload_requested.admin_userName ? { admin_userName: payload_requested.admin_userName } : {}));
    }
    else if (user_auth_type_specified === structure_1.default.USER_DESC) {
        save_payload_properties = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (payload_requested.user_registered_email ? { user_registered_email: payload_requested.user_registered_email } : {})), (payload_requested.user_entered_password ? { user_entered_password: payload_requested.user_entered_password } : {})), (payload_requested.user_entered_otp_request ? { user_entered_otp_request: payload_requested.user_entered_otp_request } : {})), (payload_requested.user_entered_userName ? { user_entered_userName: payload_requested.user_entered_userName } : {})), (payload_requested.is_user_verified !== undefined ? { is_user_verified: payload_requested.is_user_verified } : {}));
        let user = null;
        if (user_auth_type_specified === structure_1.default.USER_DESC) {
            user = yield UserRegisteringModal_1.default.findOne({ registered_user_email: user_registered_email });
        }
        else if (user_auth_type_specified === structure_1.default.ADMIN_DESC) {
            user = yield AdminDataModel_1.default.findById({ admin_userEmail: admin_user_email });
        }
        request.user = user;
        if (user) {
            user.save();
        }
    }
});
exports.MODIFIED_STATE_SETTER = MODIFIED_STATE_SETTER;
//# sourceMappingURL=CommonFunctions.js.map