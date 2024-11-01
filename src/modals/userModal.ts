import mongoose, { Schema, Document } from 'mongoose';

/**
 * User Schema for MongoDB
 * @typedef {Object} User
 * @property {string} username - The username of the user
 * @property {string} email - The email of the user
 * @property {string} password - The hashed password of the user
 */
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

const userSchema: Schema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
