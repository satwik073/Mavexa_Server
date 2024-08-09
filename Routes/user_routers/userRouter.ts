import { Express , Router , Request , Response} from "express";
import { letting_user_login, letting_user_registered, verify_email_provided_user } from "../../Controllers/user_controllers/userControllersGenerated";
import { is_authenticated_user } from "../../Middlewares/user_auth_provider/Auth";
const router = Router()
router.post('/register/user', letting_user_registered)
router.post('/login/user',letting_user_login)
router.post('/verify-email', is_authenticated_user , verify_email_provided_user)
export default router