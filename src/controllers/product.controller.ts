import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.model';

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // When using multer, text fields are in req.body and the file is in req.file
    const { name, slug, description, price, brand, category, countInStock } = req.body;

    // Check for the uploaded file from multer
    if (!req.file) {
      res.status(400).json({ message: 'Product image is required.' });
      return;
    }
    
    // This is the secure URL from Cloudinary
    const imageUrl = req.file.path;

    const product = new Product({
      name,
      slug,
      description,
      price: Number(price), // Ensure price is cast to a Number
      brand,
      category,
      countInStock: Number(countInStock), // Ensure stock is a Number
      image: imageUrl,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    // The global error handler will catch any validation errors from Mongoose
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
export const updateProduct = async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
};