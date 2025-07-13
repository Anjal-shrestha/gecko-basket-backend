import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId; // ✅ Explicitly define this
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}


const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // By default, don't include the password in query results
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    // Add createdAt and updatedAt timestamps automatically
    timestamps: true,
  }
);

// Create and export the User model
export default mongoose.model<IUser>('User', UserSchema);