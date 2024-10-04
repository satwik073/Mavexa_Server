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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_CONNECTION_REQUEST_HANDLER = exports.ERROR_VALUES_FETCHER = exports.DEFAULT_EXECUTED = void 0;
const structure_1 = __importStar(require("../../Common/structure"));
exports.DEFAULT_EXECUTED = {
    ERROR: 'Something went wrong',
    MISSING_USER: (user_roles_specified) => ({
        MESSAGE: (user_roles_specified === structure_1.default.ADMIN_DESC) ? `${structure_1.default.ADMIN_DESC} account doesn't exists` : (user_roles_specified === structure_1.default.USER_DESC) ? `${structure_1.default.USER_DESC} account doesn't exists` : `Can't determine`
    })
};
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
    },
    INVALID_CREDENTIALS_PROVIDED: (user_auth_type_specified) => ({
        INVALID_CREDENTIALS: (user_auth_type_specified === structure_1.default.USER_DESC) ? `${structure_1.default.USER_DESC.toLowerCase()} provided Invalid credentials, try using different ones` : `Invalid credentials, ${structure_1.default.ADMIN_DESC.toLowerCase()} cannot log in through this endpoint.`
    })
};
exports.DATABASE_CONNECTION_REQUEST_HANDLER = {
    DATABASE_CONNECTION_REQUEST: (database_connection_request) => ({
        MESSAGE: (database_connection_request === structure_1.DatabaseTrace.SUCCESS_FETCHING) ? `🆗 Connection ${structure_1.DatabaseTrace.SUCCESS_FETCHING}fuly estaiblished between client and server` : (database_connection_request === structure_1.DatabaseTrace.ERROR_ENCOUNTERED) ? `Connection between client and server can't be estaiblished` : (database_connection_request === structure_1.DatabaseTrace.DEFAULT_PARAMETER) ? `MONGO_DB_URL_ESTAIBLISHED is not defined in environment variables` : `Connection between client and server can't be estaiblished`
    })
};
//# sourceMappingURL=PreDefinedErrors.js.map