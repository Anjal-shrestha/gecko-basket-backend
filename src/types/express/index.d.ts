// Import the IUser interface from your user model
import { IUser } from '../../models/User.model';

// This block tells TypeScript to add a new property to the existing Request interface
declare global {
  namespace Express {
    export interface Request {
      // The 'user' property is now defined as being of type IUser, but optional
      user?: IUser;
    }
  }
}