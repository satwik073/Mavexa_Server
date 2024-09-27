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
exports.email_service_enabled = void 0;
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const dotenv_1 = __importDefault(require("dotenv"));
const use_styles_1 = require("../Config/Email/Constants/use_styles");
const structure_1 = __importStar(require("../Common/structure"));
const PreDefinedErrors_1 = require("../Constants/Errors/PreDefinedErrors");
const PreDefinedSuccess_1 = require("../Constants/Success/PreDefinedSuccess");
dotenv_1.default.config();
const mailjet = require('node-mailjet')
    .apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
const email_service_enabled = (email_sending_data_wrapped) => __awaiter(void 0, void 0, void 0, function* () {
    const Modifier = {
        RC_USER: email_sending_data_wrapped.receivers_username,
        RC_EMAIL_CONFIG: email_sending_data_wrapped.receivers_email,
        SD_EMAIL_CONFIG: email_sending_data_wrapped.senders_email,
        PD_C: email_sending_data_wrapped.product_by_company,
        VR_OTP: email_sending_data_wrapped.otp_for_verification,
    };
    try {
        const mail_generating_content = server_1.default.renderToStaticMarkup(react_1.default.createElement(use_styles_1.EMAIL_CONFIG_TEMPLATE, { receivers_username: Modifier.RC_USER, product_by_company: Modifier.PD_C, otp_for_verification: Modifier.VR_OTP }));
        const request_granted = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [{
                    From: { Email: Modifier.SD_EMAIL_CONFIG, Name: Modifier.PD_C },
                    To: [{ Email: Modifier.RC_EMAIL_CONFIG, Name: Modifier.RC_USER }],
                    Subject: `${Modifier.PD_C}`,
                    TextPart: `${Modifier.RC_USER} ${Modifier.VR_OTP}${Modifier.PD_C}${Modifier.PD_C}`,
                    HTMLPart: mail_generating_content,
                }
            ]
        });
        yield request_granted;
        console.log((0, PreDefinedSuccess_1.EMAIL_SESSION_RELAY)(structure_1.default.USER_DESC), Modifier.RC_EMAIL_CONFIG);
    }
    catch (error_displayed) {
        console.error(new structure_1.EmailResponseControllingError(PreDefinedErrors_1.DEFAULT_EXECUTED.ERROR));
    }
});
exports.email_service_enabled = email_service_enabled;
//# sourceMappingURL=EmailServices.js.map