// 1. Import NextFunction, RequestHandler, and Response for full type safety
import { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // <--- FIX 1: ADD THIS IMPORT
import User from '../models/User.model';
import { registerSchema, loginSchema } from '../validations/auth.validation';

// Your registerUser function (it's correct)
export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { body } = registerSchema.parse(req);

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = new User({
      name: body.name,
      email: body.email,
      password: hashedPassword,
       role: body.role,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// loginUser function with fixes
export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { body } = loginSchema.parse(req);

    const user = await User.findOne({ email: body.email }).select('+password');

    if (!user || !(await bcrypt.compare(body.password, user.password!))) {
      // FIX 2: REMOVE 'return' FROM THE LINE BELOW
      res.status(401).json({ message: 'Invalid email or password' });
      return; // Use a standalone return to exit the function
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};