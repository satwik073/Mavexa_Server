"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveExistingUserFlows = exports.creatingVirtualFLows = void 0;
// Import necessary modules
const structure_1 = require("../../Common/structure");
const ErrorHandlerReducer_1 = require("../../Middlewares/Error/ErrorHandlerReducer");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
exports.creatingVirtualFLows = (0, ErrorHandlerReducer_1.ASYNC_ERROR_HANDLER_ESTAIBLISHED)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { displayName, descriptionConfig, accountOwnerId, isWorkflowAllowed, isWorkflowEnabled } = request.body;
        const missingFields = (0, ErrorHandlerReducer_1.MISSING_FIELDS_VALIDATOR)({
            displayName, descriptionConfig
        }, response, structure_1.AuthTypeDeclared.USER_LOGIN);
        if (missingFields)
            return missingFields;
        const trackedData = yield (0, ErrorHandlerReducer_1.DATA_PROCESSOR)({
            displayName,
            accountOwnerId: ((_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id) || accountOwnerId,
            descriptionConfig,
            isWorkflowAllowed,
            isWorkflowEnabled
        }, structure_1.SchemaCreationType.__WORKFLOWS);
        if (trackedData === null || trackedData === void 0 ? void 0 : trackedData.success) {
            return response.status(http_status_codes_1.default.CREATED).json({
                message: "Virtual Flows created successfully",
                workflowData: trackedData.workflowData
            });
        }
        else {
            return response.status(http_status_codes_1.default.BAD_REQUEST).json({
                message: trackedData.message || "Failed to create virtual flows"
            });
        }
    }
    catch (error) {
        console.error("Error in creatingVirtualFLows:", error);
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Virtual Flows creation unsuccessful",
            error: (error === null || error === void 0 ? void 0 : error.message) || error
        });
    }
}));
exports.retrieveExistingUserFlows = (0, ErrorHandlerReducer_1.ASYNC_ERROR_HANDLER_ESTAIBLISHED)((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const _userID = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id;
        return response === null || response === void 0 ? void 0 : response.status(http_status_codes_1.default.OK).json({
            message: "User Flows retrieved successfully",
            userID: _userID
        });
    }
    finally {
    }
}));
//# sourceMappingURL=workflowsControllersGenerated.js.map