import { Request, Response } from 'express';

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = (req: Request, res: Response) => {
  // The user object is attached to the request in the 'protect' middleware
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};