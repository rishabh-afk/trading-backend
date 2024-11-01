import User from "../modals/userModal";

/**
 * User Service
 */
export class UserService {
    /**
     * Create a new user
     * @param {Object} userData - Data to create a user
     * @param {string} userData.username - The username of the user
     * @param {string} userData.email - The email of the user
     * @param {string} userData.password - The hashed password of the user
     * @returns {Promise<Object>} - The created user
     */
    static async createUser(userData: { username: string; email: string; password: string }) {
        const user = new User(userData);
        return await user.save();
    }
}
