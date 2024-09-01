import { Express , Router } from "express";
import { authorized_admin_account, get_all_registered_user_profile } from "../../Controllers/admin_controller/adminControllerGenerated";
import { is_authenticated_user } from "../../Middlewares/user_auth_provider/Auth";
import { ADMIN_SUPPORT_CONFIGURATION } from "../../Constants/RoutesDefined/RoutesFormed";
ADMIN_SUPPORT_CONFIGURATION

const router = Router()

router.post('/register/admin', authorized_admin_account)
router.get(ADMIN_SUPPORT_CONFIGURATION.admin_access_users , is_authenticated_user ,get_all_registered_user_profile )
export default router