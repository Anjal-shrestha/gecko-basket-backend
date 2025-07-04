import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

interface JwtPayload {
  id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        // FIX #1
        res.status(401).json({ message: 'No user found with this id' });
        return;
      }

      next();
    } catch (error) {
      // FIX #2
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    // FIX #3
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // The 'protect' middleware should have already attached the user to the request.
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed to the next middleware/controller.
  } else {
    // 403 Forbidden is the appropriate status code for a user who is
    // authenticated but not authorized to access a resource.
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};