const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//?@description     Get or Search all users
//?@route           GET /api/user?search=
//?@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req?.user?._id } });
  res.send(users);
});

//?@description     Register new user
//?@route           POST /api/user/
//?@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { userName, userEmail, password, userImage } = req.body;

  if (!userName || !userEmail || !password) {
    res.status(400);
    throw new Error("Please Enter All Fields");
  }

  const userExists = await User.findOne({ userEmail });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: userName,
    email: userEmail,
    password,
    pic: userImage,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

//?@description     Auth the user
//?@route           POST /api/users/login
//?@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { userEmail, password } = req.body;

  const user = await User.findOne({ email: userEmail });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { allUsers, registerUser, authUser };
