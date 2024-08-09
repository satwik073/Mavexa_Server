import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');
import user_detailed_description from '../../Model/user_model/UserRegisteringModal';


interface AuthenticatedRequest extends Request {
    user?: any;
}

interface DecodedTokenData {
    id: string;
}

export const is_authenticated_user = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { authorization } = request.headers;

        if (authorization && authorization.startsWith("Bearer ")) {
            const fetching_token = authorization.split(" ")[1];
            if (!fetching_token) throw new Error("Token can't be fetched at this moment");

            const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
            if (!SECRET_KEY_FETCHED) throw new Error("JWT Secret key not defined");

            const decoding_token_data = jwt.verify(fetching_token, SECRET_KEY_FETCHED) as DecodedTokenData;

            const user = await user_detailed_description.findById(decoding_token_data.id);
            if (!user) {
                return response.status(401).json({ Error: "User not found" });
            }

            (request as AuthenticatedRequest).user = user;
            next();
        } else {
            return response.status(401).json({ Error: "Authorization token not found, Login first to access Resources" });
        }
    } catch (error) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: (error as Error).message });
    }
};
