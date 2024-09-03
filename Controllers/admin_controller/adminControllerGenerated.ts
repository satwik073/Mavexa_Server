import { Request, Response } from "express";
import admin_detailed_structure_description from "../../Model/admin_model/AdminDataModel";
import RolesSpecified, { AuthTypeDeclared } from "../../Common/structure";
import { ASYNC_ERROR_HANDLER_ESTAIBLISHED, EXISTING_USER_FOUND_IN_DATABASE, MISSING_FIELDS_VALIDATOR } from "../../Middlewares/Error/ErrorHandlerReducer";
import { DECODING_INCOMING_SECURITY_PASSCODE, JWT_KEY_GENERATION_ONBOARDED, SECURING_PASSCODE } from "../../Constants/Functions/CommonFunctions";
import user_detailed_description from "../../Model/user_model/UserRegisteringModal";
import { SUCCESS_VALUES_FETCHER } from "../../Constants/Success/PreDefinedSuccess";
import { HTTPS_STATUS_CODE } from "../../server";
import { ERROR_VALUES_FETCHER } from "../../Constants/Errors/PreDefinedErrors";

interface AdminRegistrationModel {
    admin_userName: string,
    admin_userEmail: string,
    admin_userPassword: string,
    authorities_provided_by_role?: RolesSpecified.ADMIN_DESC
}

export const authorized_admin_account = ASYNC_ERROR_HANDLER_ESTAIBLISHED(async (request: Request<{}, {}, AdminRegistrationModel>, response: Response) => {
    const { admin_userEmail, admin_userName, admin_userPassword } = request.body;
    const is_exists_missing_fields = MISSING_FIELDS_VALIDATOR({ admin_userEmail, admin_userName, admin_userPassword }, response, AuthTypeDeclared.USER_REGISTRATION)
    if (is_exists_missing_fields) return is_exists_missing_fields
    await EXISTING_USER_FOUND_IN_DATABASE(admin_userEmail, AuthTypeDeclared.USER_REGISTRATION, RolesSpecified.ADMIN_DESC)
    const hashed_password_generated = await SECURING_PASSCODE(admin_userPassword)
    const admin_registration_data = new admin_detailed_structure_description({ admin_userEmail, admin_userName, admin_userPassword: hashed_password_generated })
    await admin_registration_data.save();
    if( admin_registration_data) {
        const token_for_authentication_generated = await JWT_KEY_GENERATION_ONBOARDED(admin_registration_data.id)
        return response.status(HTTPS_STATUS_CODE.OK).json({
            success: true,
            message: SUCCESS_VALUES_FETCHER.ENTITY_ONBOARDED_FULFILED(AuthTypeDeclared.USER_REGISTRATION , RolesSpecified.ADMIN_DESC),
            admin_data: admin_registration_data,
            token_generated: token_for_authentication_generated
        })
    }


})

export const authorized_admin_login = ASYNC_ERROR_HANDLER_ESTAIBLISHED(async (request: Request, response: Response) => {
    const { admin_userEmail, admin_userPassword } = request.body;
    const is_exists_missing_fields = MISSING_FIELDS_VALIDATOR({ admin_userEmail, admin_userPassword }, response, AuthTypeDeclared.USER_LOGIN);
    if (is_exists_missing_fields) return is_exists_missing_fields;
    const is_admin_credentials_valid = await EXISTING_USER_FOUND_IN_DATABASE(admin_userEmail, AuthTypeDeclared.USER_LOGIN, RolesSpecified.ADMIN_DESC)
    return !is_admin_credentials_valid
    ? response.status(404).json({ Error: "User not found." })
    : 'admin_userPassword' in is_admin_credentials_valid
        ? await DECODING_INCOMING_SECURITY_PASSCODE(admin_userPassword, is_admin_credentials_valid.admin_userPassword)
            ? ( async () => {
                const token_for_authentication_generated = await JWT_KEY_GENERATION_ONBOARDED(is_admin_credentials_valid._id)
                return response.status(HTTPS_STATUS_CODE.OK).json({
                    success: true,
                    message: "User logged in successfully",
                    userInfo: is_admin_credentials_valid,
                    token: token_for_authentication_generated
                });
            })()
            : response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json(ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(RolesSpecified.USER_DESC))
        : response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json(ERROR_VALUES_FETCHER.INVALID_CREDENTIALS_PROVIDED(RolesSpecified.ADMIN_DESC));

})

export const get_all_registered_user_profile = async (request: Request, response: Response) => {
    try {
        const collecting_total_data = await user_detailed_description.find();
        return response.status(200).json({
            success: true,
            message: "all users data fetched successfully",
            total_data: collecting_total_data
        })

    } catch {
        return response.status(500).json({ Error: 'Something went wrong, try again later' })
    }
}