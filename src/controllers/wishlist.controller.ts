import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose'; // <-- THE FIX IS HERE
import User, { IUser } from '../models/User.model';

// Define a custom Request type for this controller
interface IAuthRequest extends Request {
  user?: IUser;
}

// @desc    Get user's wishlist
// @route   GET /api/v1/wishlist
// @access  Private
export const getWishlist = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id).populate('wishlist');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a product to wishlist
// @route   POST /api/v1/wishlist
// @access  Private
export const addToWishlist = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json(user.wishlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.wishlist = user.wishlist.filter(
      (id: Types.ObjectId) => id.toString() !== productId
    );
    await user.save();

    res.json(user.wishlist);
  } catch (error) {
    next(error);
  }
};