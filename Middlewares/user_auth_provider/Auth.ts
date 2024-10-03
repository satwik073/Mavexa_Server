import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');
import user_detailed_description from '../../Model/user_model/UserRegisteringModal';
import RolesSpecified from '../../Common/structure';
import { ADMIN_SUPPORT_CONFIGURATION , USER_SUPPORT_CONFIGURATION } from '../../Constants/RoutesDefined/RoutesFormed';
import admin_detailed_structure_description from '../../Model/admin_model/AdminDataModel';
import { DEFAULT_EXECUTED } from '../../Constants/Errors/PreDefinedErrors';
import HTTPS_STATUS_CODE from "http-status-codes";

interface AuthenticatedRequest extends Request {
    user?: any;
}

interface DecodedTokenData {
    [x: string]: RolesSpecified;
    id: RolesSpecified;
}

export const is_authenticated_user = async (request: Request, response: Response, next_forward: NextFunction) => {
    try {
        const { authorization } = request.headers;

        if (authorization && authorization.startsWith("Bearer ")) {
            const fetching_token = authorization.split(" ")[1];
            const modified_token_role = authorization.split(" ")[2];
            if (!fetching_token) throw new Error("Token can't be fetched at this moment");

            const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
            if (!SECRET_KEY_FETCHED) throw new Error("JWT Secret key not defined");

            const decoding_token_data = jwt.verify(fetching_token, SECRET_KEY_FETCHED) as DecodedTokenData;
            console.log(decoding_token_data)
            
            const  user =  (modified_token_role === RolesSpecified.USER_DESC) ? await user_detailed_description.findById(decoding_token_data.id) : (modified_token_role === RolesSpecified.ADMIN_DESC) ? await admin_detailed_structure_description.findById(decoding_token_data.id) : null
            if (!user && modified_token_role === RolesSpecified.USER_DESC) {
                return response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json({ Error: DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.USER_DESC).MESSAGE });
            }else if ( !user && modified_token_role === RolesSpecified.ADMIN_DESC){
                return response.status(HTTPS_STATUS_CODE.UNAUTHORIZED).json({ Error: DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.ADMIN_DESC).MESSAGE });
            }

            (request as AuthenticatedRequest).user = user;
            return user?.authorities_provided_by_role === RolesSpecified.ADMIN_DESC 
            ? ([ADMIN_SUPPORT_CONFIGURATION.admin_access_users].includes(request.path) 
                ? next_forward() 
                : response.status(403).json({ Error: "Forbidden: You don't have permission to access this resource" }))
            : user?.authorities_provided_by_role === RolesSpecified.USER_DESC 
                ? ([USER_SUPPORT_CONFIGURATION.user_profile, USER_SUPPORT_CONFIGURATION.user_reverification, USER_SUPPORT_CONFIGURATION.reset_user_password , USER_SUPPORT_CONFIGURATION.verify_email_portal].includes(request.path) 
                    ? next_forward() 
                    : response.status(403).json({ Error: "Forbidden: You don't have permission to access this resource" }))
                : response.status(403).json({ Error: "Forbidden: Invalid user role", details : DEFAULT_EXECUTED.MISSING_USER(RolesSpecified.EMPTY).MESSAGE});
        
        } else {
            return response.status(401).json({ Error: "Authorization token not found, Login first to access Resources" });
        }
    } catch (error) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: (error as Error).message });
    }
};


