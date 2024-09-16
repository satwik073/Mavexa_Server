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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.email_service_enabled = void 0;
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const EmailTemplate_1 = __importDefault(require("../Config/Email/EmailTemplate"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mailjet = require('node-mailjet')
    .apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
const email_service_enabled = (email_sending_data_wrapped) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const htmlContent = server_1.default.renderToStaticMarkup(react_1.default.createElement(EmailTemplate_1.default, { receivers_username: email_sending_data_wrapped.receivers_username, product_by_company: email_sending_data_wrapped.product_by_company, otp_for_verification: email_sending_data_wrapped.otp_for_verification }));
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
            Messages: [
                {
                    From: {
                        Email: email_sending_data_wrapped.senders_email,
                        Name: email_sending_data_wrapped.product_by_company
                    },
                    To: [
                        {
                            Email: email_sending_data_wrapped.receivers_email,
                            Name: email_sending_data_wrapped.receivers_username
                        }
                    ],
                    Subject: `Your OTP Code for ${email_sending_data_wrapped.product_by_company}`,
                    TextPart: `Hello ${email_sending_data_wrapped.receivers_username},\n\nHere is your OTP Code: ${email_sending_data_wrapped.otp_for_verification}\n\nIf you did not request this code, please ignore this email.\n\nThank you for choosing ${email_sending_data_wrapped.product_by_company}!\n\nBest regards,\nThe ${email_sending_data_wrapped.product_by_company} Team`,
                    HTMLPart: htmlContent
                }
            ]
        });
        const result = yield request;
        console.log('Email sent successfully:', result.body);
    }
    catch (error) {
        console.error("Error sending email:", error.message);
        console.error(error);
    }
});
exports.email_service_enabled = email_service_enabled;
//# sourceMappingURL=EmailServices.js.map