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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_KEY_GENERATION_ONBOARDED = exports.OTP_VALIDATOR_SETTLE = exports.DECODING_INCOMING_SECURITY_PASSCODE = exports.SECURING_PASSCODE = exports.OTP_GENERATOR_CALLED = void 0;
const PreDefinedErrors_1 = require("../Errors/PreDefinedErrors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const OTP_GENERATOR_CALLED = (entered_password_registration, otp_for_verification) => __awaiter(void 0, void 0, void 0, function* () {
    return Math.floor(100000 + Math.random() * 900000).toString();
});
exports.OTP_GENERATOR_CALLED = OTP_GENERATOR_CALLED;
const SECURING_PASSCODE = (entered_password_registration) => __awaiter(void 0, void 0, void 0, function* () {
    const salted_credentials = yield bcrypt.genSalt(10);
    return yield bcrypt.hash(entered_password_registration, salted_credentials);
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
//# sourceMappingURL=CommonFunctions.js.map