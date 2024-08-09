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
Object.defineProperty(exports, "__esModule", { value: true });
exports.email_service_enabled = void 0;
const postmark = require('postmark');
const dotenv = require('dotenv');
dotenv.config();
const server_client_token_id = process.env.SERVER_CLIENT_POSTMARK_ID;
if (!server_client_token_id) {
    console.error("Postmark server client token ID is missing");
}
const client = server_client_token_id ? new postmark.ServerClient(server_client_token_id) : null;
const email_service_enabled = (email_sending_data_wrapped) => __awaiter(void 0, void 0, void 0, function* () {
    if (!client) {
        console.log(server_client_token_id);
        console.error("Postmark client not initialized");
        return;
    }
    try {
        yield client.sendEmail({
            From: email_sending_data_wrapped.senders_email,
            To: email_sending_data_wrapped.recievers_email,
            Subject: `Your OTP Code for ${email_sending_data_wrapped.product_by_company}`,
            HtmlBody: `
                <html>
                    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #fef4e5;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
                            <tr>
                                <td style="padding: 20px; background: #f7c300; color: #ffffff; text-align: center;">
                                    <h1 style="margin: 0; font-size: 24px;">Welcome to ${email_sending_data_wrapped.product_by_company}!</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px;">
                                    <p style="font-size: 16px; line-height: 1.5; color: #333333;">Hello ${email_sending_data_wrapped.recievers_username},</p>
                                    <p style="font-size: 16px; line-height: 1.5; color: #333333;">Here is your One-Time Password (OTP) for verifying your account:</p>
                                    <h2 style="color: #f7c300; text-align: center; font-weight: bold; font-size: 32px; margin: 10px 0;">${email_sending_data_wrapped.otp_for_verfication}</h2>
                                    <p style="font-size: 16px; line-height: 1.5; color: #333333;">If you did not request this code, please ignore this email.</p>
                                    <p style="font-size: 16px; line-height: 1.5; color: #333333;">Thank you for choosing ${email_sending_data_wrapped.product_by_company}!</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px; background: #fef4e5; text-align: center;">
                                    <p style="font-size: 14px; color: #888888; margin: 0;">&copy; ${new Date().getFullYear()} ${email_sending_data_wrapped.product_by_company}. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                </html>
            `,
            TextBody: `Hello ${email_sending_data_wrapped.recievers_username},\n\nHere is your OTP Code: ${email_sending_data_wrapped.otp_for_verfication}\n\nIf you did not request this code, please ignore this email.\n\nThank you for choosing ${email_sending_data_wrapped.product_by_company}!\n\nBest regards,\nThe ${email_sending_data_wrapped.product_by_company} Team`,
            MessageStream: "broadcast"
        });
        console.log(`Email sent successfully to ${email_sending_data_wrapped.recievers_email}`);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.email_service_enabled = email_service_enabled;
