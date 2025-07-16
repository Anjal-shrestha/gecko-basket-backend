import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User.model';

// Define a custom Request type for this controller
interface IAuthRequest extends Request {
  user?: IUser;
}

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private
export const getCart = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id).populate('cart.product');
    if (!user) {
      // FIX: Remove 'return' from this line
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user.cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update an item in the cart
// @route   POST /api/v1/cart
// @access  Private
export const addToCart = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      // FIX: Remove 'return' from this line
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    const populatedUser = await user.populate('cart.product');
    res.status(200).json(populatedUser.cart);

  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from the cart
// @route   DELETE /api/v1/cart/:productId
// @access  Private
export const removeFromCart = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      // FIX: Remove 'return' from this line
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.cart = user.cart.filter(
      ({ product }) => product.toString() !== productId
    );
    await user.save();

    const populatedUser = await user.populate('cart.product');
    res.json(populatedUser.cart);
    
  } catch (error) {
    next(error);
  }
};