// Import necessary modules
import { AuthTypeDeclared, SchemaCreationType } from "../../Common/structure";
import { ASYNC_ERROR_HANDLER_ESTAIBLISHED, DATA_PROCESSOR, MISSING_FIELDS_VALIDATOR } from "../../Middlewares/Error/ErrorHandlerReducer";
import HTTPS_STATUS_CODE from "http-status-codes";
import { Request, Response } from "express";
import mongoose, { Schema } from "mongoose";

interface WorkflowSchema {
    displayName: string;
    accountOwnerId: mongoose.Schema.Types.ObjectId;
    descriptionConfig: string;
    isWorkflowEnabled: boolean;
    isWorkflowAllowed: boolean;
}

interface AuthenticatedRequest extends Request {
    user?: any;  
}

export const creatingVirtualFLows = ASYNC_ERROR_HANDLER_ESTAIBLISHED(async (request: Request<{}, {}, WorkflowSchema, AuthenticatedRequest>, response: Response) => {
    try {
        const { displayName, descriptionConfig, accountOwnerId, isWorkflowAllowed, isWorkflowEnabled } = request.body;
        const missingFields = MISSING_FIELDS_VALIDATOR({
            displayName, descriptionConfig
        }, response, AuthTypeDeclared.USER_LOGIN);

        if (missingFields) return missingFields;
        const trackedData = await DATA_PROCESSOR({
            displayName,
            accountOwnerId: request?.user?.id || accountOwnerId,  
            descriptionConfig,
            isWorkflowAllowed,
            isWorkflowEnabled
        }, SchemaCreationType.__WORKFLOWS);
        if (trackedData?.success) {
            return response.status(HTTPS_STATUS_CODE.CREATED).json({
                message: "Virtual Flows created successfully",
                workflowData: trackedData.workflowData
            });
        } else {
            return response.status(HTTPS_STATUS_CODE.BAD_REQUEST).json({
                message: trackedData.message || "Failed to create virtual flows"
            });
        }

    } catch (error : any) {
        console.error("Error in creatingVirtualFLows:", error);
        return response.status(HTTPS_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: "Virtual Flows creation unsuccessful",
            error: error?.message || error
        });
    }
});


export const retrieveExistingUserFlows = ASYNC_ERROR_HANDLER_ESTAIBLISHED(async(request : AuthenticatedRequest , response : Response) => {
    try {
        const _userID = request?.user?.id;
        return response?.status(HTTPS_STATUS_CODE.OK).json({
            message: "User Flows retrieved successfully",
            userID : _userID
        })
    }
})