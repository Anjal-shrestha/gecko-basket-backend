// 1. Import NextFunction along with RequestHandler
import { RequestHandler, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.model';
import { registerSchema } from '../validations/auth.validation';

// 2. Add 'next' to the function's parameters
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
    // 3. Now 'next' is defined and can be used here
    next(error); 
  }
};