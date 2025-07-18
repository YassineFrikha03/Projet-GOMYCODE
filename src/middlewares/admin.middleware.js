import User from '../models/user.model.js';
import handleError from './errors/handleError.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return handleError(res, null, "Access denied, no token provided", 401);
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRET_KEY);

        const user = await User.findById(decoded.id);
        if (!user) {
            return handleError(res, null, "User not found", 404);
        }
        if (!user.isAdmin) {
            return handleError(res, null, "Access denied, not an admin", 403);
        }

        req.user = user;
        next();
    } catch (error) {
      console.log("Error in isAdmin middleware:", error);
        return handleError(res, null, "Invalid or expired token", 401);
    }
};

export default isAdmin;
