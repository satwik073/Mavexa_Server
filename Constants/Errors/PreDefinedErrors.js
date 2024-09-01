"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_VALUES_FETCHER = void 0;
const structure_1 = require("../../Common/structure");
exports.ERROR_VALUES_FETCHER = {
    EMPTY_FIELDS_VALIDATOR: (user_auth_type_specified) => ({
        MESSAGE: `All fields are required to ${user_auth_type_specified.toLowerCase()} the user`
    }),
    USER_FOUND_OR_NOT_CONTROLLED: (user_detected) => ({
        USER_LOGIN_MESSAGE: `User does not exists try ${structure_1.AuthTypeDeclared.USER_LOGIN} using different Credentials`,
        USER_REGISTRATION_SUPPORT: `User Already exists try ${structure_1.AuthTypeDeclared.USER_REGISTRATION.toLowerCase()}ing with different email`
    }),
    JWT_DETECTED_ERRORS: {
        JWT_NOT_DETECTED: `JWT secret key not detected in the request`
    }
};
//# sourceMappingURL=PreDefinedErrors.js.map