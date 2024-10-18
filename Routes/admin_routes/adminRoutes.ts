import { Express , Router } from "express";
import { authorized_admin_account, authorized_admin_login, get_all_registered_user_profile } from "../../Controllers/admin_controller/adminControllerGenerated";
import { is_authenticated_user } from "../../Middlewares/user_auth_provider/Auth";
import { ADMIN_SUPPORT_CONFIGURATION } from "../../Constants/RoutesDefined/RoutesFormed";
ADMIN_SUPPORT_CONFIGURATION

const router = Router()

router.post(ADMIN_SUPPORT_CONFIGURATION.admin_registration_initialised, authorized_admin_account)
router.post(ADMIN_SUPPORT_CONFIGURATION.admin_login_initailised , authorized_admin_login)
router.get(ADMIN_SUPPORT_CONFIGURATION.admin_access_users , get_all_registered_user_profile )

export default router