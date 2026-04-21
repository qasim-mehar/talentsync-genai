const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");
const userModel = require("../models/user.model");
async function userAuthMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const isTokenBlacklisted = await blacklistTokenModel.findOne({ token });
  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "Login again!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
}

module.exports = { userAuthMiddleware };
