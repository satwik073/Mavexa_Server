"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = require("../../Middlewares/user_auth_provider/Auth");
const workflowsControllersGenerated_1 = require("../../Controllers/WorkflowControllers/workflowsControllersGenerated");
const RoutesFormed_1 = require("../../Constants/RoutesDefined/RoutesFormed");
const structure_1 = require("../../Common/structure");
const router = (0, express_1.Router)();
router.post(RoutesFormed_1.SETTINGS_INITIATED.generatingRouteForSchema('__WORKFLOWS', structure_1.DefaultRequestMethods.POST), Auth_1.is_authenticated_user, workflowsControllersGenerated_1.creatingVirtualFLows);
exports.default = router;
//# sourceMappingURL=workFlowRouter.js.map