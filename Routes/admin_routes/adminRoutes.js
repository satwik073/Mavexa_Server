"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminControllerGenerated_1 = require("../../Controllers/admin_controller/adminControllerGenerated");
const RoutesFormed_1 = require("../../Constants/RoutesDefined/RoutesFormed");
RoutesFormed_1.ADMIN_SUPPORT_CONFIGURATION;
const router = (0, express_1.Router)();
router.post(RoutesFormed_1.ADMIN_SUPPORT_CONFIGURATION.admin_registration_initialised, adminControllerGenerated_1.authorized_admin_account);
router.post(RoutesFormed_1.ADMIN_SUPPORT_CONFIGURATION.admin_login_initailised, adminControllerGenerated_1.authorized_admin_login);
router.get(RoutesFormed_1.ADMIN_SUPPORT_CONFIGURATION.admin_access_users, adminControllerGenerated_1.get_all_registered_user_profile);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map