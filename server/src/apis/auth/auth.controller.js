import bcrypt from "bcryptjs";
import {
  LoginValidation,
  RegisterationValidation,
} from "../../validation/user.validation.js";
import ValidationError from "./../../utils/errors/ValidationError.js";
import BaseError from "../../utils/errors/BaseError.js";
import { generateJWT } from "../../middlewares/auth.middleware.js";
import prisma from "../../db/prismaClient.js";

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie("access_token", null, {
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      httpOnly: true,
    });
    res.cookie("refresh_token", null, {
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      httpOnly: true,
    });
    res.status(200).json({ message: "user logged out successfully" });
    //res.redirect("http://172.27.0.1:5173/auth/");
  } catch (error) {
    next(error);
  }
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate request data
    const { error, value } = RegisterationValidation.validate({
      name,
      email,
      password,
    });
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new BaseError("Validation Error", 409, true, "User already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const user = await prisma.user.create({
      data: { name, email, password: passwordHash },
    });

    // Exclude password from response
    const { password: savedPassword, ...userWithoutPassword } = user;

    return res.status(201).json({
      message: "Signed Up successfully",
      data: null,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user, save refresh token in cookie , generate and send access token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    const dataToValidate = {
      email,
      password,
    };

    const { error, value } = LoginValidation.validate(dataToValidate);

    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new BaseError("Validation Error", 401, true, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new BaseError("Validation Error", 401, true, "Invalid credentials");

    // generate accessToken--------------------------
    const accessToken = generateJWT(
      user,
      "5m",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = generateJWT(
      user,
      "7d" /*7days*/,
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 5 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: savedPassword, ...userWithoutPassword } = user;

    return res.status(201).json({
      data: userWithoutPassword,
      message: "Logged In Successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
