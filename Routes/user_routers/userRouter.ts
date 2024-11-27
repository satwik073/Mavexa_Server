import { Express , Router , Request , Response} from "express";
import { get_user_profile, letting_user_login, letting_user_registered, resend_otp_for_verification_request, reset_password_for_verified_user, UserAuthPersist, UserRegistrationProcess, verify_email_provided_user } from "../../Controllers/user_controllers/userControllersGenerated";
import { is_authenticated_user } from "../../Middlewares/user_auth_provider/Auth";
import { ADMIN_SUPPORT_CONFIGURATION, USER_SUPPORT_CONFIGURATION } from "../../Constants/RoutesDefined/RoutesFormed";
const router = Router()
router.post(USER_SUPPORT_CONFIGURATION?.register_user, letting_user_registered)
router.post(USER_SUPPORT_CONFIGURATION.login_user,UserAuthPersist)
router.post(USER_SUPPORT_CONFIGURATION.verify_email_portal,is_authenticated_user , verify_email_provided_user)
router.get(USER_SUPPORT_CONFIGURATION.user_profile, is_authenticated_user , get_user_profile)
router.put(USER_SUPPORT_CONFIGURATION.user_reverification, is_authenticated_user , resend_otp_for_verification_request)
router.put(USER_SUPPORT_CONFIGURATION.reset_user_password, is_authenticated_user ,reset_password_for_verified_user)

export default router