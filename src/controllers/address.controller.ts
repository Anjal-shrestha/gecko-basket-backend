import { Request, Response, NextFunction } from 'express';
import User, { IUser, IAddress } from '../models/User.model';
import { Types } from 'mongoose'; // Import Types for casting

// Define a custom Request type for this controller
interface IAuthRequest extends Request {
  user?: IUser;
}

// @desc    Get all of a user's shipping addresses
// @route   GET /api/v1/users/addresses
// @access  Private
export const getAddresses = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user.shippingAddresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new shipping address
// @route   POST /api/v1/users/addresses
// @access  Private
export const addAddress = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.shippingAddresses.push(req.body);
    await user.save();
    res.status(201).json(user.shippingAddresses);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a shipping address
// @route   PUT /api/v1/users/addresses/:id
// @access  Private
export const updateAddress = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // THE FIX: Cast to a Mongoose DocumentArray to access the .id() method
        const addresses = user.shippingAddresses as Types.DocumentArray<IAddress>;
        const address = addresses.id(req.params.id);

        if (address) {
            Object.assign(address, req.body);
            await user.save();
            res.json(user.shippingAddresses);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a shipping address
// @route   DELETE /api/v1/users/addresses/:id
// @access  Private
export const deleteAddress = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // THE FIX: Use the same casting and remove the subdocument
        const addresses = user.shippingAddresses as Types.DocumentArray<IAddress>;
        const address = addresses.id(req.params.id);
        
        if (address) {
            address.deleteOne();
            await user.save();
            res.json(user.shippingAddresses);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        next(error);
    }
};