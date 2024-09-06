import { Request, Response, NextFunction } from "express";
import { DATABASE_CONNECTION_REQUEST_HANDLER, ERROR_VALUES_FETCHER } from "../../Constants/Errors/PreDefinedErrors";
import RolesSpecified, { AdminDocument, AuthTypeDeclared, DatabaseExitTraceRemaining, DatabaseTrace, SuccessManager, UserAuthControllingError, UserDocument } from "../../Common/structure";
import user_detailed_description from "../../Model/user_model/UserRegisteringModal";
import admin_detailed_structure_description from "../../Model/admin_model/AdminDataModel";
import mongoose from "mongoose";

export const ASYNC_ERROR_HANDLER_ESTAIBLISHED = (fn: Function) => (request: Request, response: Response, next_function: NextFunction) => Promise.resolve(fn(request, response, next_function)).catch(next_function)


export const MISSING_FIELDS_VALIDATOR = (fields_parameter_expression: Record<string, any>, response: Response, user_auth_type_specified: AuthTypeDeclared) => {
    for (const [key_validator, value_validator] of Object.entries(fields_parameter_expression)) {
        if (!value_validator?.trim()) {
            return response.status(400).json(ERROR_VALUES_FETCHER.EMPTY_FIELDS_VALIDATOR(user_auth_type_specified).MESSAGE);
        }
    }
    return null
}
export const EXISTING_USER_FOUND_IN_DATABASE = async (
    user_registered_email: string,
    user_auth_type_specified: AuthTypeDeclared,
    authorities_provided_by_role: RolesSpecified
): Promise<UserDocument | AdminDocument | null> => {
    const exisiting_user_found = authorities_provided_by_role === RolesSpecified.ADMIN_DESC
        ? await admin_detailed_structure_description.findOne({ admin_userEmail: user_registered_email }) as AdminDocument | null
        : await user_detailed_description.findOne({ registered_user_email: user_registered_email }) as UserDocument | null;

    return user_auth_type_specified === AuthTypeDeclared.USER_REGISTRATION && exisiting_user_found
        ? (() => { throw new UserAuthControllingError(ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(user_auth_type_specified).USER_REGISTRATION_SUPPORT); })()
        : user_auth_type_specified === AuthTypeDeclared.USER_LOGIN && !exisiting_user_found
        ? (() => { throw new UserAuthControllingError(ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(user_auth_type_specified).USER_LOGIN_MESSAGE); })()
        : exisiting_user_found;
};


export const DATABASE_CONDTIONALS = async(url_session : string | undefined) =>{
    if( !url_session) throw new DatabaseExitTraceRemaining(DATABASE_CONNECTION_REQUEST_HANDLER.DATABASE_CONNECTION_REQUEST(DatabaseTrace.DEFAULT_PARAMETER).MESSAGE);
    await mongoose.connect(url_session).then(()=>{
        throw new SuccessManager(DATABASE_CONNECTION_REQUEST_HANDLER.DATABASE_CONNECTION_REQUEST(DatabaseTrace.SUCCESS_FETCHING).MESSAGE)
    }).catch((error_value_displayed)=>{
        throw new DatabaseExitTraceRemaining(DATABASE_CONNECTION_REQUEST_HANDLER.DATABASE_CONNECTION_REQUEST(DatabaseTrace.DEFAULT_PARAMETER).MESSAGE)
    })
}
