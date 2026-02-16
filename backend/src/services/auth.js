import User from "../db/models/user.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUserService = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken(user);

  return { user, accessToken };
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

export const refreshUserTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User not found");

  return { accessToken: generateAccessToken(user) };
};

export const getUserProfileService = (userId) => {
  return User.findById(userId).select("-password");
};
