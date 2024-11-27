"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = require("../../Middlewares/user_auth_provider/Auth");
const workflowsControllersGenerated_1 = require("../../Controllers/WorkflowControllers/workflowsControllersGenerated");
const router = (0, express_1.Router)();
router.post('/workflow/create', Auth_1.is_authenticated_user, workflowsControllersGenerated_1.creatingVirtualFLows);
exports.default = router;
//# sourceMappingURL=workFlowRoter.js.map