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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const structure_1 = __importDefault(require("../../Common/structure"));
const user_detailed_description_schema = new mongoose_1.Schema({
    registered_user_email: {
        type: String,
        unique: true,
        required: true,
    },
    registered_user_password: {
        type: String,
        required: true,
    },
    registered_username: {
        type: String,
        required: true,
    },
    authorities_provided_by_role: {
        type: String,
        enum: Object.values(structure_1.default),
        default: structure_1.default.USER_DESC
    },
    otp_for_verification: {
        type: String,
    },
    is_user_verified: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});
const user_detailed_description = mongoose_1.default.model('Registration', user_detailed_description_schema);
exports.default = user_detailed_description;
//# sourceMappingURL=UserRegisteringModal.js.map