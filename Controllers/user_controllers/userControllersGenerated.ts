import { Request, Response } from "express";
import user_detailed_description from "../../Model/user_model/UserRegisteringModal";
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

import { email_service_enabled } from "../../Services/EmailServices";


interface UserRegisterRequest {
    registered_username: string;
    registered_user_email: string;
    registered_user_password: string;
}

interface AuthenticatedRequest extends Request {
    user?: any;
}
interface UserLoginRequest {
    registered_user_email: string;
    registered_user_password: string;
}
interface UserVerificationMethod {
    otp_for_verification: string
}

export const letting_user_registered = async (request: Request<{}, {}, UserRegisterRequest>, response: Response) => {
    try {
        const { registered_username, registered_user_email, registered_user_password } = request.body;
        if (!registered_user_email || !registered_user_password || !registered_username) {
            return response.status(400).json({ Error: "All fields are required to register the user" });
        }
        const exisiting_user_found = await user_detailed_description.findOne({ registered_user_email });
        if (exisiting_user_found) {
            return response.status(400).json({ Error: "User already exists, try registering with a different email" });
        }
        const otp_generating_code_block = Math.floor(100000 + Math.random() * 900000).toString();
        const salted_credentials = await bcrypt.genSalt(10);
        const hashed_password_generated = await bcrypt.hash(registered_user_password, salted_credentials);
        const new_registered_user_defined = new user_detailed_description({
            registered_user_email,
            registered_username,
            registered_user_password: hashed_password_generated,
            otp_for_verification: otp_generating_code_block
        });
        await new_registered_user_defined.save();
        const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
        if (!SECRET_KEY_FETCHED) throw new Error("JWT Secret key not defined");

        const token_for_authentication_generated = jwt.sign(
            { id: new_registered_user_defined._id },
            SECRET_KEY_FETCHED,
            { expiresIn: process.env.JWT_EXPIRY_DATE_ASSIGNED || '30d' }
        );
        await email_service_enabled({
            senders_email: process.env.SENDER_EMAIL || '',
            recievers_email: new_registered_user_defined.registered_user_email,
            otp_for_verfication: new_registered_user_defined.otp_for_verification,
            product_by_company: process.env.PRODUCT_NAME || '',
            recievers_username: new_registered_user_defined.registered_username
        });
        return response.status(200).json({
            success: true,
            message_Displayed: "User Registered Successfully",
            userInfo: new_registered_user_defined,
            token: token_for_authentication_generated
        });

    } catch (error) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: (error as Error).message });
    }
}

export const letting_user_login = async (request: Request<{}, {}, UserLoginRequest>, response: Response) => {
    try {
        const { registered_user_email, registered_user_password } = request.body;
        if (!registered_user_email || !registered_user_password) {
            return response.status(400).json({ Error: "All fields are required to login" });
        }
        const exisiting_user_found = await user_detailed_description.findOne({ registered_user_email });
        if (!exisiting_user_found) {
            return response.status(404).json({ Error: "User doesn't exist, try logging in with different credentials" });
        }
        const decoded_password_stored = await bcrypt.compare(registered_user_password, exisiting_user_found.registered_user_password);
        if (!decoded_password_stored) {
            return response.status(401).json({ Error: "Invalid credentials, try using different ones" });
        }
        const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
        if (!SECRET_KEY_FETCHED) throw new Error("JWT Secret key not defined");

        const token_for_authentication_generated = jwt.sign(
            { id: exisiting_user_found._id },
            SECRET_KEY_FETCHED,
            { expiresIn: process.env.JWT_EXPIRY_DATE_ASSIGNED || '30d' }
        );

        return response.status(200).json({
            success: true,
            message: "User logged in successfully",
            userInfo: exisiting_user_found,
            token: token_for_authentication_generated
        });

    } catch (error) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: (error as Error).message });
    }
}



export const verify_email_provided_user = async (request: AuthenticatedRequest, response: Response) => {
    try {
        const { otp_for_verification } = request.body;
        if (!otp_for_verification) {
            return response.status(400).json({ Error: "Please provide otp" });
        }
        const stored_token_for_user_request = request.user.otp_for_verification;

        if (stored_token_for_user_request) {
            if (+otp_for_verification === +stored_token_for_user_request) {
                request.user.otp_for_verification = "";
                request.user.is_user_verified = true;

                await request.user.save();

                return response.status(200).json({ success: true, message: "Email verified successfully" });
            } else {
                return response.status(400).json({ Error: "Invalid OTP, please try again" });
            }
        } else {
            return response.status(400).json({ Error: "No OTP found for user, please request a new one" });
        }
    } catch (error_value_displayed) {
        console.error(error_value_displayed);
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: (error_value_displayed as Error).message });
    }
}
export const resend_otp_for_verification_request = async (request: AuthenticatedRequest, response: Response) => {
    try {
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user) throw new Error("User not found");

        if (!fetched_loggedin_user.is_user_verified) {
            const redefining_otp_generation = Math.floor(100000 + Math.random() * 900000).toString();
            fetched_loggedin_user.otp_for_verification = redefining_otp_generation;
            await fetched_loggedin_user.save();

            await email_service_enabled({
                senders_email: process.env.SENDER_EMAIL || '',
                recievers_email: fetched_loggedin_user.registered_user_email,
                otp_for_verfication: fetched_loggedin_user.otp_for_verification,
                product_by_company: process.env.PRODUCT_NAME || '',
                recievers_username: fetched_loggedin_user.registered_username
            });

            return response.status(200).json({
                success: true,
                message: "OTP sent successfully",
                updated_user_profile_otp: fetched_loggedin_user
            });

        } else {
            return response.status(400).json({ Error: "User already verified" });
        }

    } catch (error_value_displayed) {
        console.error(error_value_displayed);
        return response.status(500).json({
            Error: 'Something went wrong, try again later',
            details: (error_value_displayed as Error).message
        });
    }
}

export const reset_password_for_verified_user = async (request: AuthenticatedRequest, response: Response) => {
    try {
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user) throw new Error("User not found");
        if (fetched_loggedin_user.is_user_verified) {
            const { registered_user_password } = request.body;
            const is_same_password_for_user = await bcrypt.compare(registered_user_password ,  fetched_loggedin_user.registered_user_password)
            if(!is_same_password_for_user){
                const salted_credentials = await bcrypt.genSalt(10);
                const hashed_password_generated = await bcrypt.hash(registered_user_password, salted_credentials);
                fetched_loggedin_user.registered_user_password = hashed_password_generated;
                await fetched_loggedin_user.save()

                return response.status(200).json({
                    success: true,
                    message: "Password Updated successfully",
                    updated_user_profile_password: fetched_loggedin_user
                });
            }
          else{
            return response.status(400).json({ Error: "Password can't be same as previous password use different one" });
          }

        }else {
            return response.status(400).json({ Error: "Password can't be reset at this moment" });
        }
    }catch (error_value_displayed) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: (error_value_displayed as Error).message });
    }
}
export const get_user_profile = async (request: AuthenticatedRequest, response: Response) => {
    try {
        const fetched_loggedin_user = request.user;
        if (!fetched_loggedin_user) throw new Error("User Can't found");
        console.log(fetched_loggedin_user)
        return response.status(200).json({
            success: true,
            message: "User Fetched successfuly",
            userInfo: fetched_loggedin_user
        })
    } catch (error_value_displayed) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: (error_value_displayed as Error).message });
    }
}

export const get_all_registered_user_profile = async( request : Request , response : Response )=>{
    try {
        const collecting_total_data =  await user_detailed_description.find();
        return response.status(200).json({
            success: true ,
            message : "all users data fetched successfully",
            total_data : collecting_total_data
        })

    }catch{
        return response.status(500).json({ Error: 'Something went wrong, try again later'})
    }
}