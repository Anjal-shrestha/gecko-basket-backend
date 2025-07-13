import { Request, Response, NextFunction } from 'express';
import Product, { IReview } from '../models/Product.model';
import { IUser } from '../models/User.model'; // 1. Import the IUser interface

// 2. Define a custom Request type that includes the 'user' property
interface IAuthRequest extends Request {
  user?: IUser; // This tells TypeScript that req.user can exist and is of type IUser
}

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, price, originalPrice, brand, category, countInStock } = req.body;
    
    if (!req.file) {
      res.status(400).json({ message: 'Product image is required.' });
      return;
    }
    
    const imageUrl = req.file.path;

    const product = new Product({
      name, slug, description,
      price: Number(price),
      originalPrice: Number(originalPrice),
      brand, category,
      countInStock: Number(countInStock),
      image: imageUrl,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find({});
  res.json(products);
};

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Get single product by slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch(error) {
    next(error)
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch(error) {
    next(error)
  }
};

// @desc    Create a new review
// @route   POST /api/v1/products/:id/reviews
// @access  Private
// 3. Use the new IAuthRequest interface for the 'req' parameter
export const createProductReview = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { rating, comment } = req.body;

  try {
    // TypeScript now understands req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      // The '!' tells TypeScript "we know user is not null here"
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user!._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      // No more errors here because IAuthRequest defines req.user and its properties
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review as IReview);

      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};