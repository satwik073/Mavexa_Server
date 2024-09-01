import { Request ,Response } from "express";
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
import admin_detailed_structure_description from "../../Model/admin_model/AdminDataModel";
import RolesSpecified, { AuthTypeDeclared } from "../../Common/structure";
import { ASYNC_ERROR_HANDLER_ESTAIBLISHED, EXISTING_USER_FOUND_IN_DATABASE, MISSING_FIELDS_VALIDATOR } from "../../Middlewares/Error/ErrorHandlerReducer";
import { SECURING_PASSCODE } from "../../Constants/Functions/CommonFunctions";
import { ERROR_VALUES_FETCHER } from "../../Constants/Errors/PreDefinedErrors";
import user_detailed_description from "../../Model/user_model/UserRegisteringModal";


interface AdminRegistrationModel {
    admin_userName : string,
    admin_userEmail : string,
    admin_userPassword : string,
    authorities_provided_by_role? : RolesSpecified.ADMIN_DESC
}
export const authorized_admin_account = ASYNC_ERROR_HANDLER_ESTAIBLISHED(async(request : Request<{}, {}, AdminRegistrationModel > , response : Response) =>{
        const {admin_userEmail , admin_userName , admin_userPassword} = request.body;
        const is_exists_missing_fields = MISSING_FIELDS_VALIDATOR({admin_userEmail , admin_userName , admin_userPassword}, response , AuthTypeDeclared.USER_REGISTRATION)
        if(is_exists_missing_fields) return is_exists_missing_fields
        await EXISTING_USER_FOUND_IN_DATABASE(admin_userEmail, AuthTypeDeclared.USER_REGISTRATION , RolesSpecified.ADMIN_DESC)
        const hashed_password_generated = await SECURING_PASSCODE(admin_userPassword)
        const admin_registration_data = new admin_detailed_structure_description({admin_userEmail, admin_userName , admin_userPassword : hashed_password_generated})
        await admin_registration_data.save();
        const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
        if (!SECRET_KEY_FETCHED) throw new Error(ERROR_VALUES_FETCHER.JWT_DETECTED_ERRORS.JWT_NOT_DETECTED);
        const token_for_authentication_generated = jwt.sign(
            { id: admin_registration_data._id },
            SECRET_KEY_FETCHED,
            { expiresIn: process.env.JWT_EXPIRY_DATE_ASSIGNED || '30d' }
        );
        return response.status(200).json({
            success: true,
            message : "Admin Registered Successfully",
            admin_data : admin_registration_data,
            token_generated : token_for_authentication_generated
        })


})

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