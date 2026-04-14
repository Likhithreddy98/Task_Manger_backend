const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};


const registerUser = async ({ name, email, password }) => {

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists.');
  }


  const user = await User.create({ name, email, password });


  const token = generateToken(user._id);

  logger.info(`New user registered: ${email}`);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};


const loginUser = async ({ email, password }) => {

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }


  if (!user.password) {
    throw new ApiError(
      401,
      'This account uses Google login. Please sign in with Google.'
    );
  }


  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }


  const token = generateToken(user._id);

  logger.info(`User logged in: ${email}`);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};


const generateGoogleToken = (user) => {
  return generateToken(user._id);
};


const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    googleId: user.googleId ? true : false,
    createdAt: user.createdAt,
  };
};

module.exports = {
  registerUser,
  loginUser,
  generateGoogleToken,
  getUserProfile,
};
