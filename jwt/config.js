const dotenv = require("dotenv");
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD || "test123";
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD || "test123456789";

module.exports = {
  JWT_ADMIN_PASSWORD,
  JWT_USER_PASSWORD,
};
