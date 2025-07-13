import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.model';

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, price, brand, category, countInStock } = req.body;

    if (!req.file) {
      // THE FIX IS HERE: The `return` keyword is removed from this line.
      res.status(400).json({ message: 'Product image is required.' });
      return; // A standalone return is used to exit the function.
    }
    
    const imageUrl = req.file.path;

    const product = new Product({
      name,
      slug,
      description,
      price: Number(price),
      brand,
      category,
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