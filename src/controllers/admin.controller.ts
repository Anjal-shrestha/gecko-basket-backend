import { Request, Response } from 'express';
import User from '../models/User.model';

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({});
  res.status(200).json(users);
};