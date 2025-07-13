import { Request, Response, NextFunction } from 'express';
import Product, { IReview } from '../models/Product.model';

// ... (your createProduct, getAllProducts, etc. functions go here) ...
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add originalPrice to the destructuring
    const { name, slug, description, price, originalPrice, brand, category, countInStock } = req.body;

    if (!req.file) {
      res.status(400).json({ message: 'Product image is required.' });
      return;
    }
    
    const imageUrl = req.file.path;

    const product = new Product({
      name,
      slug,
      description,
      price: Number(price),
      originalPrice: Number(originalPrice), // Add originalPrice here
      brand,
      category,
      countInStock: Number(countInStock),
      image: imageUrl,
      // `rating`, `numReviews`, and `reviews` will use default values
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find({});
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

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
  } catch (error) {
    next(error);
  }
};

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
export const createProductReview = async (req: Request, res: Response, next: NextFunction) => {
  const { rating, comment } = req.body;

  try {
    // Check if user is logged in (TypeScript now knows req.user exists)
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user!._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: 'Product already reviewed' });
        return;
      }

      const review: Partial<IReview> = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id, // This no longer causes an error
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