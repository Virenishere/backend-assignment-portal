const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../jwt/config.js");

function userMiddleware(req, res, next) {
    // Fetch user token from a dedicated cookie
    let token = req.cookies.userToken;

    if (!token) {
        // Check for a token in the headers as a fallback
        token = req.headers['user-token'];
        if (!token) {
            return res.status(401).json({ message: "User token is required" });
        }
    }

    try {
        // Verify the user token
        const decoded = jwt.verify(token, JWT_USER_PASSWORD);

        // Attach user information to the request object
        req.userId = decoded.id;

        next(); // Proceed to the next middleware or route
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired user token" });
    }
}

module.exports = { userMiddleware };
