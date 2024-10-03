import React from 'react';
import ReactDOMServer from 'react-dom/server';
import dotenv from 'dotenv';
import { EMAIL_CONFIG_TEMPLATE } from '../Config/Email/Constants/use_styles';
import RolesSpecified, { EmailResponseControllingError, SendingEmailToUser } from '../Common/structure';
import { DEFAULT_EXECUTED } from '../Constants/Errors/PreDefinedErrors';
import { EMAIL_SESSION_RELAY } from '../Constants/Success/PreDefinedSuccess';
import path from 'path';

const env = process.argv[2] === 'prod' ? 'production' : 'staging';
if ( env && process.env.VERCEL_ENV) {
    console.log(`Running on Vercel in ${process.env.VERCEL_ENV} mode.`);
    if (process.env.VERCEL_ENV === 'production') {
        dotenv.config({ path: path.resolve(__dirname, './.env.production') });
    } else {
        dotenv.config({ path: path.resolve(__dirname, './.env.staging') });
    }
}
else {
     dotenv.config()
}

const mailjet = require('node-mailjet')
    .apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

export const email_service_enabled = async (email_sending_data_wrapped: SendingEmailToUser) => {

    const Modifier = {
        RC_USER: email_sending_data_wrapped.receivers_username,
        RC_EMAIL_CONFIG: email_sending_data_wrapped.receivers_email,
        SD_EMAIL_CONFIG: email_sending_data_wrapped.senders_email,
        PD_C: email_sending_data_wrapped.product_by_company,
        VR_OTP: email_sending_data_wrapped.otp_for_verification,
    }
    try {
        const mail_generating_content = ReactDOMServer.renderToStaticMarkup(
            <EMAIL_CONFIG_TEMPLATE receivers_username={Modifier.RC_USER} product_by_company={Modifier.PD_C} otp_for_verification={Modifier.VR_OTP}
            />
        );
        const request_granted = mailjet.post('send', { version: 'v3.1' }).request({
                Messages: [{
                        From: {Email: Modifier.SD_EMAIL_CONFIG ,Name: Modifier.PD_C},
                        To: [{Email: Modifier.RC_EMAIL_CONFIG,Name: Modifier.RC_USER}],
                        Subject: `${Modifier.PD_C}`,
                        TextPart: `${Modifier.RC_USER} ${Modifier.VR_OTP}${Modifier.PD_C}${Modifier.PD_C}`,
                        HTMLPart: mail_generating_content ,
                    }
                ]
            });
        await request_granted;
        console.log(EMAIL_SESSION_RELAY(RolesSpecified.USER_DESC) , Modifier.RC_EMAIL_CONFIG);
    } catch (error_displayed) {
        console.error(new EmailResponseControllingError(DEFAULT_EXECUTED.ERROR)); 
    }
};
