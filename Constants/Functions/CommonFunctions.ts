import { response } from "express";
import { ERROR_VALUES_FETCHER } from "../Errors/PreDefinedErrors";
import RolesSpecified from "../../Common/structure";
import admin_detailed_structure_description from "../../Model/admin_model/AdminDataModel";
import user_detailed_description from "../../Model/user_model/UserRegisteringModal";
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
interface AuthenticatedRequest extends Request {
    user?: any;
}
export const OTP_GENERATOR_CALLED = async (entered_password_registration: string, otp_for_verification?: any) => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export const SECURING_PASSCODE = async (entered_password_registration: string) => {

    const salted_credentials = await bcrypt.genSalt(10);
    return await bcrypt.hash(entered_password_registration, salted_credentials);
}
export const DECODING_INCOMING_SECURITY_PASSCODE = async (user_entered_password: string, user_registered_password: string) => {
    return await bcrypt.compare(user_entered_password, user_registered_password);
}

export const OTP_VALIDATOR_SETTLE = async (user_entered_otp_request: string, software_generated_otp_request: string) => {
    return (+user_entered_otp_request === +software_generated_otp_request) ? true : false
}

export const JWT_KEY_GENERATION_ONBOARDED = async (user_generated_id: string) => {
    const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
    if (!SECRET_KEY_FETCHED) throw new Error(ERROR_VALUES_FETCHER.JWT_DETECTED_ERRORS.JWT_NOT_DETECTED);
    return jwt.sign(
        { id: user_generated_id },
        SECRET_KEY_FETCHED,
        { expiresIn: process.env.JWT_EXPIRY_DATE_ASSIGNED || '30d' }
    );
}

export const MODIFIED_STATE_SETTER = async (user_auth_type_specified: RolesSpecified, request: Request, user_registered_email?: string, user_entered_password?: string, user_entered_otp_request?: string, user_entered_userName?: string, admin_user_email?: string, admin_userPassword?: string, admin_userName?: string, is_user_verified?: boolean) => {
    const payload_requested: any = {
        ...(user_registered_email ? { user_registered_email } : {}),
        ...(user_entered_password ? { user_entered_password } : {}),
        ...(user_entered_otp_request ? { user_entered_otp_request } : {}),
        ...(user_entered_userName ? { user_entered_userName } : {}),
        ...(admin_user_email ? { admin_user_email } : {}),
        ...(admin_userPassword ? { admin_userPassword } : {}),
        ...(admin_userName ? { admin_userName } : {}),
        ...(is_user_verified ? { is_user_verified } : {})
    };
    let save_payload_properties: any = {};
    if (user_auth_type_specified === RolesSpecified.ADMIN_DESC) {
        save_payload_properties = {
            ...(payload_requested.admin_userEmail ? { admin_userEmail: payload_requested.admin_userEmail } : {}),
            ...(payload_requested.admin_userPassword ? { admin_userPassword: payload_requested.admin_userPassword } : {}),
            ...(payload_requested.admin_userName ? { admin_userName: payload_requested.admin_userName } : {})
        };
    }
    else if (user_auth_type_specified === RolesSpecified.USER_DESC) {
        save_payload_properties = {
            ...(payload_requested.user_registered_email ? { user_registered_email: payload_requested.user_registered_email } : {}),
            ...(payload_requested.user_entered_password ? { user_entered_password: payload_requested.user_entered_password } : {}),
            ...(payload_requested.user_entered_otp_request ? { user_entered_otp_request: payload_requested.user_entered_otp_request } : {}),
            ...(payload_requested.user_entered_userName ? { user_entered_userName: payload_requested.user_entered_userName } : {}),
            ...(payload_requested.is_user_verified !== undefined ? { is_user_verified: payload_requested.is_user_verified } : {})
        };

        let user: any = null;

        if (user_auth_type_specified === RolesSpecified.USER_DESC) {
            user = await user_detailed_description.findOne({ registered_user_email: user_registered_email });
        } else if (user_auth_type_specified === RolesSpecified.ADMIN_DESC) {
            user = await admin_detailed_structure_description.findById({ admin_userEmail: admin_user_email });
        }

        (request as AuthenticatedRequest).user = user;
        if(user) {
            user.save()
        }
    }

}