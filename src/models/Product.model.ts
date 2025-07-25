import mongoose, { Schema, Document, Types } from 'mongoose';

// Interface for a single review
export interface IReview extends Document {
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

// Updated interface for the Product document
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;         // Sale price
  originalPrice: number; // Actual, non-sale price
  image: string;
  brand: string;
  category: string;
  countInStock: number;
  rating: number;        // Average rating
  numReviews: number;    // Total number of reviews
  reviews: IReview[]
  tags: string[];     // Array of review sub-documents
  createdAt: Date;
  updatedAt: Date;
}

// Sub-schema for individual reviews
const reviewSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true }, // User's name
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, {
  timestamps: true,
});


const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required:true },
    price: { type: Number, required: true, default: 0 },
    originalPrice: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema], 
    tags: [{ type: String }],// Embed the review schema here
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>('Product', ProductSchema);