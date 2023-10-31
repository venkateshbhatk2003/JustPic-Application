const express = require("express");
const User = require("../model/user");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post("/create-user", catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  const userEmail = await User.findOne({ email });

  if (userEmail) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    folder: "avatars",
  });

  const user = new User({
    name: name,
    email: email,
    password: password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  user.save()

  const activationToken = createActivationToken(user);

  const activationUrl = `http://localhost:3000/activation/${activationToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
    });
    res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}));

const createActivationToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

router.post("/activation", catchAsyncErrors(async (req, res, next) => {
  const { activation_token } = req.body;

  try {
    const { id } = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

    let user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }


    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 400));
  }
}));

router.post("/login-user", catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  sendToken(user, 200, res);
}));


module.exports = router;
