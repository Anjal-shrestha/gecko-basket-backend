

import { IUser } from '../../models/User.model';

// Extend the Express Request interface
declare global {
  namespace Express {
    export interface Request {
      user?: IUser; // Add the 'user' property, making it optional
    }
  }
}