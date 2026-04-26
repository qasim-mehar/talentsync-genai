const userModel = require("../models/user.model");
const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
async function userRegisterController(req, res) {
  const { userName, password, email } = req.body;

  try {
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
      { _id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User register successfully",
      user:{
        id: user._id,
      userName: user.userName,
      email: user.email,
      }
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      message: "Internal server error during registration",
    });
  }
}

async function userLoginController(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required to login",
    });
  }

  const isUserWithEmailExist = await userModel
    .findOne({
      email,
    })
    .select("+password");

  if (!isUserWithEmailExist) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await isUserWithEmailExist.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }
  const token = jwt.sign(
    { _id: isUserWithEmailExist._id, userName: isUserWithEmailExist.userName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);
  res.status(200).json({
    message: "Login successfull",
    user:{
      id: isUserWithEmailExist._id,
      userName:isUserWithEmailExist.userName,
      email:isUserWithEmailExist.email,
    }
  });
}

async function userLogoutController(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({
      message: "Logout sucessfully",
    });
  }
  const blacklistToken = await blacklistTokenModel.create({
    token,
  });

  res.clearCookie("token");

  res.status(200).json({
    message: "Logout sucessfully",
  });
}
async function getMeController(req, res) {
  const user = await userModel.findById({ _id: req.user.id });

  res.status(200).json({
    message: "User info fetched",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.userName,
    },
  });
}
module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
  getMeController,
};
