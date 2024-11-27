import { Express , Router , Request , Response} from "express";
import { is_authenticated_user } from "../../Middlewares/user_auth_provider/Auth";

import { creatingVirtualFLows } from "../../Controllers/WorkflowControllers/workflowsControllersGenerated";
const router = Router()

router.post('/workflow/create' , is_authenticated_user ,creatingVirtualFLows)
export default router