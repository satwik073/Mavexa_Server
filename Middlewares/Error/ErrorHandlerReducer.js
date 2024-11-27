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
exports.TRACKING_DATA_OBJECT = exports.DATABASE_CONDTIONALS = exports.DATA_PROCESSOR = exports.EXISTING_USER_FOUND_IN_DATABASE = exports.MISSING_FIELDS_VALIDATOR = exports.ASYNC_ERROR_HANDLER_ESTAIBLISHED = void 0;
const PreDefinedErrors_1 = require("../../Constants/Errors/PreDefinedErrors");
const structure_1 = __importStar(require("../../Common/structure"));
const UserRegisteringModal_1 = __importDefault(require("../../Model/user_model/UserRegisteringModal"));
const AdminDataModel_1 = __importDefault(require("../../Model/admin_model/AdminDataModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const CommonFunctions_1 = require("../../Constants/Functions/CommonFunctions");
const EmailServices_1 = require("../../Services/EmailServices");
const Workflows_1 = __importDefault(require("../../Model/WorkFlowModel/Workflows"));
const ASYNC_ERROR_HANDLER_ESTAIBLISHED = (fn) => (request, response, next_function) => { (request && response && next_function) ? Promise.resolve(fn(request, response, next_function)).catch(next_function) : fn(); };
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
        ? (() => { throw new structure_1.UserAuthControllingError(PreDefinedErrors_1.ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(user_auth_type_specified).USER_REGISTRATION_SUPPORT); })()
        : user_auth_type_specified === structure_1.AuthTypeDeclared.USER_LOGIN && !exisiting_user_found
            ? (() => { throw new structure_1.UserAuthControllingError(PreDefinedErrors_1.ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(user_auth_type_specified).USER_LOGIN_MESSAGE); })()
            : exisiting_user_found;
});
exports.EXISTING_USER_FOUND_IN_DATABASE = EXISTING_USER_FOUND_IN_DATABASE;
const DATA_PROCESSOR = (payloadSent, dataPushingType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (dataPushingType === structure_1.SchemaCreationType.__WORKFLOWS) {
            const workflow = new Workflows_1.default(payloadSent);
            yield workflow.save();
            return { success: true, message: 'Workflow saved successfully', workflowData: workflow };
        }
        else {
            return { success: false, message: 'Invalid schema type for workflow creation' };
        }
    }
    catch (error) {
        console.error('Error in DATA_PROCESSOR:', error);
        return { success: false, message: 'Error saving workflow', error };
    }
});
exports.DATA_PROCESSOR = DATA_PROCESSOR;
const DATABASE_CONDTIONALS = (url_session) => __awaiter(void 0, void 0, void 0, function* () {
    if (!url_session) {
        throw new structure_1.DatabaseExitTraceRemaining(PreDefinedErrors_1.DATABASE_CONNECTION_REQUEST_HANDLER.DATABASE_CONNECTION_REQUEST(structure_1.DatabaseTrace.DEFAULT_PARAMETER).MESSAGE);
    }
    return yield mongoose_1.default.connect(url_session)
        .then(() => {
        const successMessage = PreDefinedErrors_1.DATABASE_CONNECTION_REQUEST_HANDLER.DATABASE_CONNECTION_REQUEST(structure_1.DatabaseTrace.SUCCESS_FETCHING).MESSAGE;
        console.log((successMessage));
        return new structure_1.SuccessManager(successMessage);
    })
        .catch(() => new structure_1.DatabaseExitTraceRemaining(PreDefinedErrors_1.DATABASE_CONNECTION_REQUEST_HANDLER.DATABASE_CONNECTION_REQUEST(structure_1.DatabaseTrace.DEFAULT_PARAMETER).MESSAGE));
});
exports.DATABASE_CONDTIONALS = DATABASE_CONDTIONALS;
const TRACKING_DATA_OBJECT = (user_provided_data_carried, user_auth_type_specified) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let recognized_user;
        let token_for_authentication_generated;
        if (user_auth_type_specified === structure_1.default.ADMIN_DESC) {
            recognized_user = yield new AdminDataModel_1.default(user_provided_data_carried).save();
        }
        else if (user_auth_type_specified === structure_1.default.USER_DESC) {
            recognized_user = yield new UserRegisteringModal_1.default(user_provided_data_carried).save();
            yield (0, EmailServices_1.email_service_enabled)({
                senders_email: process.env.SENDER_EMAIL || '',
                receivers_email: recognized_user.registered_user_email,
                otp_for_verification: recognized_user.otp_for_verification,
                product_by_company: process.env.PRODUCT_NAME || '',
                receivers_username: recognized_user.registered_username
            });
            console.log(recognized_user);
        }
        else {
            throw new structure_1.UserAuthControllingError(PreDefinedErrors_1.DEFAULT_EXECUTED.ERROR);
        }
        token_for_authentication_generated = yield (0, CommonFunctions_1.JWT_KEY_GENERATION_ONBOARDED)(recognized_user.id);
        return { recognized_user, token_for_authentication_generated };
    }
    catch (error) {
        throw error;
    }
});
exports.TRACKING_DATA_OBJECT = TRACKING_DATA_OBJECT;
//# sourceMappingURL=ErrorHandlerReducer.js.map