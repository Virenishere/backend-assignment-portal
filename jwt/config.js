const dotenv = require("dotenv");
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD || "test123";
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD || "test123456789";

console.log("JWT_USER_PASSWORD:", JWT_USER_PASSWORD);  // Check the JWT_USER_PASSWORD
console.log("JWT_ADMIN_PASSWORD:", JWT_ADMIN_PASSWORD);  // Check the JWT_ADMIN_PASSWORD

module.exports = {
  JWT_ADMIN_PASSWORD,
  JWT_USER_PASSWORD,
};
