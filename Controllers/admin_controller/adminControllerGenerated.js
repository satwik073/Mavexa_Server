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
exports.get_all_registered_user_profile = exports.authorized_admin_login = exports.authorized_admin_account = void 0;
const AdminDataModel_1 = __importDefault(require("../../Model/admin_model/AdminDataModel"));
const structure_1 = __importStar(require("../../Common/structure"));
const ErrorHandlerReducer_1 = require("../../Middlewares/Error/ErrorHandlerReducer");
const CommonFunctions_1 = require("../../Constants/Functions/CommonFunctions");
const UserRegisteringModal_1 = __importDefault(require("../../Model/user_model/UserRegisteringModal"));
const PreDefinedSuccess_1 = require("../../Constants/Success/PreDefinedSuccess");
const server_1 = require("../../server");
const PreDefinedErrors_1 = require("../../Constants/Errors/PreDefinedErrors");
exports.authorized_admin_account = (0, ErrorHandlerReducer_1.ASYNC_ERROR_HANDLER_ESTAIBLISHED)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { admin_userEmail, admin_userName, admin_userPassword } = request.body;
    const is_exists_missing_fields = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ admin_userEmail, admin_userName, admin_userPassword }, response, structure_1.AuthTypeDeclared.USER_REGISTRATION);
    if (is_exists_missing_fields)
        return is_exists_missing_fields;
    yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)(admin_userEmail, structure_1.AuthTypeDeclared.USER_REGISTRATION, structure_1.default.ADMIN_DESC);
    const hashed_password_generated = yield (0, CommonFunctions_1.SECURING_PASSCODE)(admin_userPassword);
    const admin_registration_data = new AdminDataModel_1.default({ admin_userEmail, admin_userName, admin_userPassword: hashed_password_generated });
    yield admin_registration_data.save();
    if (admin_registration_data) {
        const token_for_authentication_generated = yield (0, CommonFunctions_1.JWT_KEY_GENERATION_ONBOARDED)(admin_registration_data.id);
        return response.status(server_1.HTTPS_STATUS_CODE.OK).json({
            success: true,
            message: PreDefinedSuccess_1.SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(structure_1.AuthTypeDeclared.USER_REGISTRATION, structure_1.default.ADMIN_DESC),
            admin_data: admin_registration_data,
            token_generated: token_for_authentication_generated
        });
    }
}));
exports.authorized_admin_login = (0, ErrorHandlerReducer_1.ASYNC_ERROR_HANDLER_ESTAIBLISHED)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { admin_userEmail, admin_userPassword } = request.body;
    const is_exists_missing_fields = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({ admin_userEmail, admin_userPassword }, response, structure_1.AuthTypeDeclared.USER_LOGIN);
    if (is_exists_missing_fields)
        return is_exists_missing_fields;
    const is_admin_credentials_valid = yield (0, ErrorHandlerReducer_1.EXISTING_USER_FOUND_IN_DATABASE)(admin_userEmail, structure_1.AuthTypeDeclared.USER_LOGIN, structure_1.default.ADMIN_DESC);
    return !is_admin_credentials_valid
        ? response.status(404).json({ Error: PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER(structure_1.default.ADMIN_DESC).MESSAGE })
        : 'admin_userPassword' in is_admin_credentials_valid
            ? (yield (0, CommonFunctions_1.DECODING_INCOMING_SECURITY_PASSCODE)(admin_userPassword, is_admin_credentials_valid.admin_userPassword))
                ? (() => __awaiter(void 0, void 0, void 0, function* () {
                    const token_for_authentication_generated = yield (0, CommonFunctions_1.JWT_KEY_GENERATION_ONBOARDED)(is_admin_credentials_valid._id);
                    return response.status(server_1.HTTPS_STATUS_CODE.OK).json({
                        success: true,
                        message: "User logged in successfully",
                        userInfo: is_admin_credentials_valid,
                        token: token_for_authentication_generated
                    });
                }))()
                : response.status(server_1.HTTPS_STATUS_CODE.UNAUTHORIZED).json(PreDefinedErrors_1.ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(structure_1.default.USER_DESC))
            : response.status(server_1.HTTPS_STATUS_CODE.UNAUTHORIZED).json(PreDefinedErrors_1.ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(structure_1.default.ADMIN_DESC));
}));
const get_all_registered_user_profile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collecting_total_data = yield UserRegisteringModal_1.default.find();
        return response.status(200).json({
            success: true,
            message: "all users data fetched successfully",
            total_data: collecting_total_data
        });
    }
    catch (_a) {
        return response.status(500).json({ Error: 'Something went wrong, try again later' });
    }
});
exports.get_all_registered_user_profile = get_all_registered_user_profile;
//# sourceMappingURL=adminControllerGenerated.js.map