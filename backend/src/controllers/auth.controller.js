const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  const isUserExists = await userModel.findOne({ email: email });

  if (isUserExists) {
    res.status(400).json({
      message: "User with this email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    fullName: { firstName, lastName },
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      email: newUser.email,
      fullName: newUser.fullName,
      _id: newUser._id,
    },
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid password!" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      email: user.email,
      fullName: user.fullName,
      _id: user._id,
    },
  });
};

const userMe = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const user = req.user;
  res.status(200).json({
    user: {
      email: user.email,
      fullName: user.fullName,
      _id: user._id,
    },
  });
};

const checkAuth = async (req, res) => {
  // If auth middleware set req.user, return authenticated status and basic user info
  if (!req.user) return res.status(200).json({ authenticated: false });

  const user = req.user;
  return res.status(200).json({
    authenticated: true,
    user: {
      email: user.email,
      fullName: user.fullName,
      _id: user._id,
    },
  });
};

// const userLogout = async (req, res) => {
//   res.clearCookie("token");
//   return res.status(200).json({ message: "Logged out" });
// };

const userLogout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
    path: "/", // VERY IMPORTANT
  });

  return res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

module.exports = { userRegister, userLogin, userMe, userLogout, checkAuth };
