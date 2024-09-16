import React from 'react';
import ReactDOMServer from 'react-dom/server';
import EmailTemplate from '../Config/Email/EmailTemplate';
import dotenv from 'dotenv';

dotenv.config();

const mailjet = require('node-mailjet')
    .apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

interface SendingEmailToUser {
    senders_email: string;
    receivers_email: string;
    otp_for_verification: string;
    product_by_company: string;
    receivers_username: string;
}

export const email_service_enabled = async (email_sending_data_wrapped: SendingEmailToUser) => {
    try {
        const htmlContent = ReactDOMServer.renderToStaticMarkup(
            <EmailTemplate
                receivers_username={email_sending_data_wrapped.receivers_username}
                product_by_company={email_sending_data_wrapped.product_by_company}
                otp_for_verification={email_sending_data_wrapped.otp_for_verification}
            />
        );

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
        const result = await request;
        console.log('Email sent successfully:', result.body);
    } catch (error) {
        console.error("Error sending email:", error.message); 
        console.error(error); 
    }
};
