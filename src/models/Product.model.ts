import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for a single review
export interface IReview extends Document {
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

// The complete interface for a Product document
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  brand: string;
  category: string;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: IReview[];
  tags: string[];
  isFeatured: boolean;
  weight: number;
  weightUnit: 'kg' | 'g';
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schema for individual reviews
const reviewSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, {
  timestamps: true,
});

// The main Product Schema
const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    tags: [{ type: String }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      required: true,
      default: 0,
    },
    weightUnit: {
      type: String,
      required: true,
      enum: ['kg', 'g'],
      default: 'g',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>('Product', ProductSchema);