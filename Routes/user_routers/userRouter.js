"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllersGenerated_1 = require("../../Controllers/user_controllers/userControllersGenerated");
const Auth_1 = require("../../Middlewares/user_auth_provider/Auth");
const RoutesFormed_1 = require("../../Constants/RoutesDefined/RoutesFormed");
const router = (0, express_1.Router)();
router.post(RoutesFormed_1.USER_SUPPORT_CONFIGURATION.register_user, userControllersGenerated_1.letting_user_registered);
router.post(RoutesFormed_1.USER_SUPPORT_CONFIGURATION.login_user, userControllersGenerated_1.letting_user_login);
router.post(RoutesFormed_1.USER_SUPPORT_CONFIGURATION.verify_email_portal, Auth_1.is_authenticated_user, userControllersGenerated_1.verify_email_provided_user);
router.get(RoutesFormed_1.USER_SUPPORT_CONFIGURATION.user_profile, Auth_1.is_authenticated_user, userControllersGenerated_1.get_user_profile);
router.put(RoutesFormed_1.USER_SUPPORT_CONFIGURATION.user_reverification, Auth_1.is_authenticated_user, userControllersGenerated_1.resend_otp_for_verification_request);
router.put(RoutesFormed_1.USER_SUPPORT_CONFIGURATION.reset_user_password, Auth_1.is_authenticated_user, userControllersGenerated_1.reset_password_for_verified_user);
exports.default = router;
//# sourceMappingURL=userRouter.js.map