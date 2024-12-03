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
exports.is_authenticated_user = void 0;
const jwt = require('jsonwebtoken');
const UserRegisteringModal_1 = __importDefault(require("../../Model/user_model/UserRegisteringModal"));
const structure_1 = __importStar(require("../../Common/structure"));
const RoutesFormed_1 = require("../../Constants/RoutesDefined/RoutesFormed");
const AdminDataModel_1 = __importDefault(require("../../Model/admin_model/AdminDataModel"));
const PreDefinedErrors_1 = require("../../Constants/Errors/PreDefinedErrors");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const is_authenticated_user = (request, response, next_forward) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = request.headers;
        if (authorization && authorization.startsWith("Bearer ")) {
            const fetching_token = authorization.split(" ")[1];
            const modified_token_role = authorization.split(" ")[2];
            if (!fetching_token)
                throw new Error("Token can't be fetched at this moment");
            const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
            if (!SECRET_KEY_FETCHED)
                throw new Error("JWT Secret key not defined");
            const decoding_token_data = jwt.verify(fetching_token, SECRET_KEY_FETCHED);
            console.log(decoding_token_data);
            const user = (modified_token_role === structure_1.default.USER_DESC) ? yield UserRegisteringModal_1.default.findById(decoding_token_data.id) : (modified_token_role === structure_1.default.ADMIN_DESC) ? yield AdminDataModel_1.default.findById(decoding_token_data.id) : null;
            if (!user && modified_token_role === structure_1.default.USER_DESC) {
                return response.status(http_status_codes_1.default.UNAUTHORIZED).json({ Error: PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER(structure_1.default.USER_DESC).MESSAGE });
            }
            else if (!user && modified_token_role === structure_1.default.ADMIN_DESC) {
                return response.status(http_status_codes_1.default.UNAUTHORIZED).json({ Error: PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER(structure_1.default.ADMIN_DESC).MESSAGE });
            }
            request.user = user;
            return (user === null || user === void 0 ? void 0 : user.authorities_provided_by_role) === structure_1.default.ADMIN_DESC
                ? ([RoutesFormed_1.ADMIN_SUPPORT_CONFIGURATION.admin_access_users].includes(request.path)
                    ? next_forward()
                    : response.status(403).json({ Error: "Forbidden: You don't have permission to access this resource" }))
                : (user === null || user === void 0 ? void 0 : user.authorities_provided_by_role) === structure_1.default.USER_DESC
                    ? ([RoutesFormed_1.USER_SUPPORT_CONFIGURATION.user_profile, RoutesFormed_1.USER_SUPPORT_CONFIGURATION.user_reverification, RoutesFormed_1.USER_SUPPORT_CONFIGURATION.reset_user_password, RoutesFormed_1.USER_SUPPORT_CONFIGURATION.verify_email_portal, RoutesFormed_1.SETTINGS_INITIATED.generatingRouteForSchema('__WORKFLOWS', structure_1.DefaultRequestMethods.POST)].includes(request.path)
                        ? next_forward()
                        : response.status(403).json({ Error: "Forbidden: You don't have permission to access this resource" }))
                    : response.status(403).json({ Error: "Forbidden: Invalid user role", details: PreDefinedErrors_1.DEFAULT_EXECUTED.MISSING_USER(structure_1.default.EMPTY).MESSAGE });
        }
        else {
            return response.status(401).json({ Error: "Authorization token not found, Login first to access Resources" });
        }
    }
    catch (error) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: error.message });
    }
});
exports.is_authenticated_user = is_authenticated_user;
//# sourceMappingURL=Auth.js.map