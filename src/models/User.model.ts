import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for a single item in the user's cart
export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

// The complete interface for a User document
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  wishlist: Types.ObjectId[];
  cart: ICartItem[];
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
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Good for security
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default mongoose.model<IUser>('User', UserSchema);