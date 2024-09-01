"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminControllerGenerated_1 = require("../../Controllers/admin_controller/adminControllerGenerated");
const Auth_1 = require("../../Middlewares/user_auth_provider/Auth");
const RoutesFormed_1 = require("../../Constants/RoutesDefined/RoutesFormed");
RoutesFormed_1.ADMIN_SUPPORT_CONFIGURATION;
const router = (0, express_1.Router)();
router.post('/register/admin', adminControllerGenerated_1.authorized_admin_account);
router.get(RoutesFormed_1.ADMIN_SUPPORT_CONFIGURATION.admin_access_users, Auth_1.is_authenticated_user, adminControllerGenerated_1.get_all_registered_user_profile);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map