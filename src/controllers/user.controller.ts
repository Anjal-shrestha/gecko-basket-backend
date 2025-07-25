import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User.model';
import bcrypt from 'bcryptjs';

// Define a custom Request type that includes the 'user' property
interface IAuthRequest extends Request {
  user?: IUser;
}

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// --- ADD THE FOLLOWING TWO FUNCTIONS ---

// @desc    Update user profile (name/email)
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/v1/users/change-password
// @access  Private
export const changeUserPassword = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id).select('+password');

    if (user && (await bcrypt.compare(oldPassword, user.password!))) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(401).json({ message: 'Invalid old password' });
    }
  } catch (error) {
    next(error);
  }
};