import { Request, Response, NextFunction } from 'express';
import Product, { IReview } from '../models/Product.model';
import { IUser } from '../models/User.model';

// This interface remains the same
interface IAuthRequest extends Request {
  user?: IUser;
}

// @desc    Get all products with advanced filtering and sorting
// @route   GET /api/v1/products
// @access  Public
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. --- FILTERING ---
    const queryObj: any = {};

    // Category Filter
    if (req.query.category) {
      queryObj.category = req.query.category as string;
    }

    // Brand Filter (supports multiple comma-separated values)
    if (req.query.brand) {
      const brands = (req.query.brand as string).split(',');
      queryObj.brand = { $in: brands };
    }
    
    // Tags Filter (supports multiple comma-separated values)
    if (req.query.tags) {
        const tags = (req.query.tags as string).split(',');
        queryObj.tags = { $in: tags };
    }

    // Price Range Filter
    if (req.query.price) {
      queryObj.price = {};
      const priceQuery = req.query.price as { gte?: string; lte?: string };
      if (priceQuery.gte) {
        queryObj.price.$gte = Number(priceQuery.gte);
      }
      if (priceQuery.lte) {
        queryObj.price.$lte = Number(priceQuery.lte);
      }
    }
    
    // Rating Filter
    if (req.query.rating && (req.query.rating as any).gte) {
        queryObj.rating = { $gte: Number((req.query.rating as any).gte) };
    }

    // "On Sale" Filter
    if (req.query.onSale === 'true') {
        queryObj.$expr = { $gt: ["$originalPrice", "$price"] };
    }

    // 2. --- SORTING ---
    const sortObj: any = {};
    if (req.query.sort) {
      const sortBy = req.query.sort as string;
      const orderBy = req.query.order === 'desc' ? -1 : 1;
      sortObj[sortBy] = orderBy;
    } else {
      // Default sort by creation date if no sort is specified
      sortObj.createdAt = -1;
    }

    // 3. --- EXECUTE QUERY ---
    const products = await Product.find(queryObj).sort(sortObj);

    res.json(products);

  } catch (error) {
    next(error);
  }
};


// Your other controller functions (createProduct, getProductById, etc.) remain unchanged below this line...

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, price, originalPrice, brand, category, countInStock,tags, weight, weightUnit } = req.body;
    
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
      tags: tags || [], 
      weight: Number(weight) || 0,   
      weightUnit: weightUnit || 'g',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
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
export const createProductReview = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { rating, comment } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user!._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }
 
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
// --- ADD THIS NEW FUNCTION ---

// @desc    Get all featured products
// @route   GET /api/v1/products/featured
// @access  Public
export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    res.json(featuredProducts);
  } catch (error) {
    next(error);
  }
};