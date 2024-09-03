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
exports.EXISTING_USER_FOUND_IN_DATABASE = exports.MISSING_FIELDS_VALIDATOR = exports.ASYNC_ERROR_HANDLER_ESTAIBLISHED = void 0;
const PreDefinedErrors_1 = require("../../Constants/Errors/PreDefinedErrors");
const structure_1 = __importStar(require("../../Common/structure"));
const UserRegisteringModal_1 = __importDefault(require("../../Model/user_model/UserRegisteringModal"));
const AdminDataModel_1 = __importDefault(require("../../Model/admin_model/AdminDataModel"));
class UserAuthControllingError extends Error {
    constructor(error_message) {
        super(error_message);
        this.name = `UserNotExitsError`;
    }
}
const ASYNC_ERROR_HANDLER_ESTAIBLISHED = (fn) => (request, response, next_function) => Promise.resolve(fn(request, response, next_function)).catch(next_function);
exports.ASYNC_ERROR_HANDLER_ESTAIBLISHED = ASYNC_ERROR_HANDLER_ESTAIBLISHED;
const MISSING_FIELDS_VALIDATOR = (fields_parameter_expression, response, user_auth_type_specified) => {
    for (const [key_validator, value_validator] of Object.entries(fields_parameter_expression)) {
        if (!(value_validator === null || value_validator === void 0 ? void 0 : value_validator.trim())) {
            return response.status(400).json(PreDefinedErrors_1.ERROR_VALUES_FETCHER.EMPTY_FIELDS_VALIDATOR(user_auth_type_specified).MESSAGE);
        }
    }
    return null;
};
exports.MISSING_FIELDS_VALIDATOR = MISSING_FIELDS_VALIDATOR;
const EXISTING_USER_FOUND_IN_DATABASE = (user_registered_email, user_auth_type_specified, authorities_provided_by_role) => __awaiter(void 0, void 0, void 0, function* () {
    const exisiting_user_found = authorities_provided_by_role === structure_1.default.ADMIN_DESC
        ? yield AdminDataModel_1.default.findOne({ admin_userEmail: user_registered_email })
        : yield UserRegisteringModal_1.default.findOne({ registered_user_email: user_registered_email });
    return user_auth_type_specified === structure_1.AuthTypeDeclared.USER_REGISTRATION && exisiting_user_found
        ? (() => { throw new UserAuthControllingError(PreDefinedErrors_1.ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(user_auth_type_specified).USER_REGISTRATION_SUPPORT); })()
        : user_auth_type_specified === structure_1.AuthTypeDeclared.USER_LOGIN && !exisiting_user_found
            ? (() => { throw new UserAuthControllingError(PreDefinedErrors_1.ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(user_auth_type_specified).USER_LOGIN_MESSAGE); })()
            : exisiting_user_found;
});
exports.EXISTING_USER_FOUND_IN_DATABASE = EXISTING_USER_FOUND_IN_DATABASE;
//# sourceMappingURL=ErrorHandlerReducer.js.map