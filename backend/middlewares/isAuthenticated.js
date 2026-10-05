
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // No token means the user is not logged in
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        try {
            // Verify JWT token
            const decode = jwt.verify(
                token,
                process.env.SECRET_KEY
            );

            if (!decode) {
                return res.status(401).json({
                    message: "Invalid token",
                    success: false,
                });
            }

            // Store user ID for the controller
            req.id = decode.userId;

            next();

        } catch (error) {

            // Token existed but has expired
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Your session has expired. Please login again.",
                    success: false,
                });
            }

            // Token exists but is invalid
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

    } catch (error) {
        console.error("Authentication Error:", error);

        return res.status(401).json({
            message: "Authentication failed",
            success: false,
        });
    }
};

export default isAuthenticated;
