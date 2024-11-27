// Import necessary modules
import { AuthTypeDeclared, SchemaCreationType } from "../../Common/structure";
import { ASYNC_ERROR_HANDLER_ESTAIBLISHED, DATA_PROCESSOR, MISSING_FIELDS_VALIDATOR } from "../../Middlewares/Error/ErrorHandlerReducer";
import HTTPS_STATUS_CODE from "http-status-codes";
import { Request, Response } from "express";
import mongoose, { Schema } from "mongoose";

// Define interfaces for WorkflowSchema and AuthenticatedRequest
interface WorkflowSchema {
    displayName: string;
    accountOwnerId: mongoose.Schema.Types.ObjectId;
    descriptionConfig: string;
    isWorkflowEnabled: boolean;
    isWorkflowAllowed: boolean;
}

interface AuthenticatedRequest extends Request {
    user?: any;  // Assuming 'user' is populated by some authentication middleware
}

// Route handler for creating virtual workflows
export const creatingVirtualFLows = ASYNC_ERROR_HANDLER_ESTAIBLISHED(async (request: Request<{}, {}, WorkflowSchema, AuthenticatedRequest>, response: Response) => {
    try {
        console.log("run")
        // Destructure fields from the request body
        const { displayName, descriptionConfig, accountOwnerId, isWorkflowAllowed, isWorkflowEnabled } = request.body;

        // Validate the required fields
        const missingFields = MISSING_FIELDS_VALIDATOR({
            displayName, descriptionConfig
        }, response, AuthTypeDeclared.USER_LOGIN);

        if (missingFields) return missingFields;
        console.log(request?.user)
        // Call the DATA_PROCESSOR to save the workflow
        const trackedData = await DATA_PROCESSOR({
            displayName,
            accountOwnerId: request.user?.id || accountOwnerId,  // Ensure the user ID is used if available
            descriptionConfig,
            isWorkflowAllowed,
            isWorkflowEnabled
        }, SchemaCreationType.__WORKFLOWS);

        // Check if the workflow was successfully created
        if (trackedData.success) {
            return response.status(HTTPS_STATUS_CODE.CREATED).json({
                message: "Virtual Flows created successfully",
                workflowData: trackedData.workflowData
            });
        } else {
            // Return a bad request response if creation failed
            return response.status(HTTPS_STATUS_CODE.BAD_REQUEST).json({
                message: trackedData.message || "Failed to create virtual flows"
            });
        }

    } catch (error) {
        console.error("Error in creatingVirtualFLows:", error);
        // Return an internal server error response
        return response.status(HTTPS_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: "Virtual Flows creation unsuccessful",
            error: error.message || error
        });
    }
});