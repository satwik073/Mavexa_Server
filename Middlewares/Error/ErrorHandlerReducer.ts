import { Request, Response, NextFunction } from "express";
import { DATABASE_CONNECTION_REQUEST_HANDLER, DEFAULT_EXECUTED, ERROR_VALUES_FETCHER } from "../../Constants/Errors/PreDefinedErrors";
import RolesSpecified, { AdminDocument, AuthTypeDeclared, DatabaseExitTraceRemaining, DatabaseTrace, SchemaCreationType, SuccessManager, UserAuthControllingError, UserDocument } from "../../Common/structure";
import user_detailed_description from "../../Model/user_model/UserRegisteringModal";
import admin_detailed_structure_description from "../../Model/admin_model/AdminDataModel";
import mongoose from "mongoose"
import { JWT_KEY_GENERATION_ONBOARDED } from "../../Constants/Functions/CommonFunctions";
import { email_service_enabled } from "../../Services/EmailServices";
import workFlowsSetting from "../../Model/WorkFlowModel/Workflows";
export const ASYNC_ERROR_HANDLER_ESTAIBLISHED = (fn: Function) => (request?: Request, response?: Response, next_function?: NextFunction) => {(request && response && next_function) ? Promise.resolve(fn(request, response, next_function)).catch(next_function) : fn()}


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
    ? (() => {  throw new UserAuthControllingError(ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(user_auth_type_specified).USER_REGISTRATION_SUPPORT); })()
    : user_auth_type_specified === AuthTypeDeclared.USER_LOGIN && !exisiting_user_found
      ? (() => {  throw new UserAuthControllingError(ERROR_VALUES_FETCHER.USER_FOUND_OR_NOT_CONTROLLED(user_auth_type_specified).USER_LOGIN_MESSAGE); })()
      : exisiting_user_found;
};



export const DATA_PROCESSOR = async (payloadSent: object, dataPushingType: SchemaCreationType) => {
  try {
    if (dataPushingType === SchemaCreationType.__WORKFLOWS) {
      const workflow = new workFlowsSetting(payloadSent);
      await workflow.save();
      return { success: true, message: 'Workflow saved successfully', workflowData: workflow };
    } else {
      return { success: false, message: 'Invalid schema type for workflow creation' };
    }
  } catch (error) {
    console.error('Error in DATA_PROCESSOR:', error);
    return { success: false, message: 'Error saving workflow', error };
  }
};


export const DATABASE_CONDTIONALS = async (url_session: string | undefined) => {
  if (!url_session) {
    throw new DatabaseExitTraceRemaining(
      DATABASE_CONNECTION_REQUEST_HANDLER.DATABASE_CONNECTION_REQUEST(DatabaseTrace.DEFAULT_PARAMETER).MESSAGE
    );
  }
  return await mongoose.connect(url_session)
    .then(() => {
      const successMessage = DATABASE_CONNECTION_REQUEST_HANDLER.DATABASE_CONNECTION_REQUEST(DatabaseTrace.SUCCESS_FETCHING).MESSAGE;
      console.log((successMessage));
      return new SuccessManager(successMessage);
    })
    .catch(() => new DatabaseExitTraceRemaining(
      DATABASE_CONNECTION_REQUEST_HANDLER.DATABASE_CONNECTION_REQUEST(DatabaseTrace.DEFAULT_PARAMETER).MESSAGE
    )
    );
}

export const TRACKING_DATA_OBJECT = async (user_provided_data_carried: {}, user_auth_type_specified: RolesSpecified) => {
  try {
    let recognized_user;
    let token_for_authentication_generated;

    if (user_auth_type_specified === RolesSpecified.ADMIN_DESC) {
      recognized_user = await new admin_detailed_structure_description(user_provided_data_carried).save();
    } else if (user_auth_type_specified === RolesSpecified.USER_DESC) {
      recognized_user = await new user_detailed_description(user_provided_data_carried).save();
      await email_service_enabled({
        senders_email: process.env.SENDER_EMAIL || '',
        receivers_email: recognized_user.registered_user_email,
        otp_for_verification:  recognized_user.otp_for_verification,
        product_by_company: process.env.PRODUCT_NAME || '',
        receivers_username:  recognized_user.registered_username
    });
      console.log(recognized_user)
    } else {
      throw new UserAuthControllingError(DEFAULT_EXECUTED.ERROR);
    }

    token_for_authentication_generated = await JWT_KEY_GENERATION_ONBOARDED(recognized_user.id);
   
    return { recognized_user, token_for_authentication_generated };
  } catch (error) {
    throw error;
  }
};