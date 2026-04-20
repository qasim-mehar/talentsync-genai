const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
async function userRegisterController(req, res) {
  const { userName, password, email } = req.body;

  if (!userName || !password || !email) {
    return res.status(400).json({
      message: "username, email and password are require",
    });
  }
  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { userName }],
  });
  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User with this email or password already exist",
    });
  }

  const user = await userModel.create({
    userName,
    email,
    password,
  });

  const token = jwt.sign(
    { id: user._id, userName: user.userName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User register successfully",
    userName: user.userName,
    email: user.email,
  });
}

module.exports = { userRegisterController };
