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
exports.SECURING_PASSCODE = exports.OTP_GENERATOR_CALLED = void 0;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const OTP_GENERATOR_CALLED = (entered_password_registration) => __awaiter(void 0, void 0, void 0, function* () {
    return Math.floor(100000 + Math.random() * 900000).toString();
});
exports.OTP_GENERATOR_CALLED = OTP_GENERATOR_CALLED;
const SECURING_PASSCODE = (entered_password_registration) => __awaiter(void 0, void 0, void 0, function* () {
    const salted_credentials = yield bcrypt.genSalt(10);
    return yield bcrypt.hash(entered_password_registration, salted_credentials);
});
exports.SECURING_PASSCODE = SECURING_PASSCODE;
//# sourceMappingURL=CommonFunctions.js.map