const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../jwt/config.js");

function adminMiddleware(req, res, next) {
    // Fetch admin token from a dedicated cookie
    let token = req.cookies.adminToken;

    if (!token) {
        // Check for a token in the headers as a fallback
        token = req.headers['admin-token'];
        if (!token) {
            return res.status(401).json({ message: "Admin token is required" });
        }
    }

    try {
        // Verify the admin token
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
        req.adminId = decoded.id;
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired admin token" });
    }
}

module.exports = { adminMiddleware };
