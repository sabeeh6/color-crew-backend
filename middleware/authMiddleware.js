import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        const token = authHeader.split(" ")[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_123);
        req.user = decoded; // Contains userId, role, email (from authService)
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid", error: error.message });
    }
};
