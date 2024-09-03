import { response } from "express";
import { ERROR_VALUES_FETCHER } from "../Errors/PreDefinedErrors";
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
export const OTP_GENERATOR_CALLED = async(entered_password_registration: string, otp_for_verification?: any)=>{
    return  Math.floor(100000 + Math.random() * 900000).toString();
}
export const SECURING_PASSCODE = async(entered_password_registration: string) =>{
    
    const salted_credentials = await bcrypt.genSalt(10);
    return await bcrypt.hash(entered_password_registration, salted_credentials);
}
export const DECODING_INCOMING_SECURITY_PASSCODE = async(user_entered_password: string , user_registered_password: string)=>{
    return await bcrypt.compare(user_entered_password, user_registered_password);
}

export const OTP_VALIDATOR_SETTLE = async( user_entered_otp_request : string , software_generated_otp_request : string )=>{
    return ( +user_entered_otp_request ===  +software_generated_otp_request) ?  true : false
}

export const JWT_KEY_GENERATION_ONBOARDED = async(user_generated_id : string ) =>{
    const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
        if (!SECRET_KEY_FETCHED) throw new Error(ERROR_VALUES_FETCHER.JWT_DETECTED_ERRORS.JWT_NOT_DETECTED);
        return  jwt.sign(
            { id: user_generated_id },
            SECRET_KEY_FETCHED,
            { expiresIn: process.env.JWT_EXPIRY_DATE_ASSIGNED || '30d' }
        );
}