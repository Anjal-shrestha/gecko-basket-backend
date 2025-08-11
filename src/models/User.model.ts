import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for a single address (must be defined before IUser)
export interface IAddress extends Document {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Interface for a single cart item
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
  shippingAddresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schema for individual addresses (must be defined before UserSchema)
const addressSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'Nepal' },
  isDefault: { type: Boolean, default: false },
});

// The main User Schema
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
    // Use the addressSchema here
    shippingAddresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);