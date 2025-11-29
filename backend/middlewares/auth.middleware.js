import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
        }

        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.log("Error in verifyToken middleware: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `Role (${req.user.role}) is not allowed to access this resource` });
        }
        next();
    };
};
