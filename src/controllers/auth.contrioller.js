const userModel = require("../models/user.model");
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
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User register successfully",
      id: user._id,
      userName: user.userName,
      email: user.email,
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
    { id: isUserWithEmailExist._id, userName: isUserWithEmailExist.userName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);
  res.status(200).json({
    message: "Login successfull",
    id: isUserWithEmailExist._id,
  });
}

module.exports = { userRegisterController, userLoginController };
