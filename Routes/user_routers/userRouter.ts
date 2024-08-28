import { Express , Router , Request , Response} from "express";
import { get_user_profile, letting_user_login, letting_user_registered, resend_otp_for_verification_request, reset_password_for_verified_user, verify_email_provided_user } from "../../Controllers/user_controllers/userControllersGenerated";
import { is_authenticated_user } from "../../Middlewares/user_auth_provider/Auth";
const router = Router()
router.post('/register/user', letting_user_registered)
router.post('/login/user',letting_user_login)
router.post('/verify-email', is_authenticated_user , verify_email_provided_user)
router.get('/user/profile', is_authenticated_user , get_user_profile)
router.put('/user/reverification', is_authenticated_user , resend_otp_for_verification_request)
router.put('/user/reset-password', is_authenticated_user ,reset_password_for_verified_user)
export default router