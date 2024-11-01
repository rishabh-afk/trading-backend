import jwt from 'jsonwebtoken';
import { strings } from '../config/messages';
import { Response, NextFunction } from 'express';

interface JwtPayload {
    id: string;
    role: 'admin' | 'user'; // Define roles
}

// Middleware to verify JWT tokens
const verifyJwtToken = (roles: Array<'admin' | 'user'>) => {
    return (req: any, res: Response, next: NextFunction) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token)
            return res.status(401).json({ message: strings?.TOKEN_MISSING });

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) {
                if (err.name === 'TokenExpiredError')
                    return res.status(401).json({ message: strings.TOKEN_EXPIRED });
                else if (err.name === 'JsonWebTokenError')
                    return res.status(403).json({ message: strings?.TOKEN_INVALID });
                else
                    return res.status(500).json({ message: strings?.SERVER_ERROR });
            }
            const payload = decoded as JwtPayload;
            if (!roles.includes(payload.role))
                return res.status(403).json({ message: strings.ACCESS_DENIED_JWT });

            req.user = payload;
            next();
        });
    };
};

export default verifyJwtToken;
