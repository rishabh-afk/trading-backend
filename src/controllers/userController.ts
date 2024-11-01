import { UserService } from '../services/userServices';
import { Request, Response, NextFunction } from 'express';
/**
 * User Controller
 */
export class UserController {
    /**
     * Create a new user
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {NextFunction} next - The next middleware function
     */
    static async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;
            const user = await UserService.createUser({ username, email, password });
            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            next(error);
        }
    }
}
