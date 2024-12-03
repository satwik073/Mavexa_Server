import { Express , Router , Request , Response} from "express";
import { is_authenticated_user } from "../../Middlewares/user_auth_provider/Auth";

import { creatingVirtualFLows } from "../../Controllers/WorkflowControllers/workflowsControllersGenerated";
import { SETTINGS_INITIATED } from "../../Constants/RoutesDefined/RoutesFormed";
import { DefaultRequestMethods, SchemaCreationType } from "../../Common/structure";
const router = Router()

router.post(SETTINGS_INITIATED.generatingRouteForSchema('__WORKFLOWS' , DefaultRequestMethods.POST) , is_authenticated_user ,creatingVirtualFLows)

export default router