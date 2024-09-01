import { response } from "express";
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
export const OTP_GENERATOR_CALLED = async(entered_password_registration : string)=>{
    return  Math.floor(100000 + Math.random() * 900000).toString();
}
export const SECURING_PASSCODE = async(entered_password_registration: string) =>{
    
    const salted_credentials = await bcrypt.genSalt(10);
    return await bcrypt.hash(entered_password_registration, salted_credentials);
}

