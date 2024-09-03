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
exports.SUCCESS_VALUES_FETCHER = void 0;
const structure_1 = __importStar(require("../../Common/structure"));
exports.SUCCESS_VALUES_FETCHER = {
    ENTITY_ONBOARDED_FULFILED: (user_auth_type_specified, user_role_specified) => ({
        SUCCESS_MESSAGE: user_role_specified === structure_1.default.ADMIN_DESC
            ? user_auth_type_specified === structure_1.AuthTypeDeclared.USER_LOGIN
                ? `${structure_1.default.ADMIN_DESC} ${structure_1.AuthTypeDeclared.USER_LOGIN} successful`
                : user_auth_type_specified === structure_1.AuthTypeDeclared.USER_REGISTRATION
                    ? `${structure_1.default.ADMIN_DESC} ${structure_1.AuthTypeDeclared.USER_REGISTRATION} successfully`
                    : null
            : user_role_specified === structure_1.default.USER_DESC
                ? user_auth_type_specified === structure_1.AuthTypeDeclared.USER_LOGIN
                    ? `${structure_1.default.USER_DESC} ${structure_1.AuthTypeDeclared.USER_LOGIN} successful`
                    : user_auth_type_specified === structure_1.AuthTypeDeclared.USER_REGISTRATION
                        ? `${structure_1.default.USER_DESC} ${structure_1.AuthTypeDeclared.USER_REGISTRATION} successfully`
                        : null
                : null
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
//# sourceMappingURL=PreDefinedSuccess.js.map