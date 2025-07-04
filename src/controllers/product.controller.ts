import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.model';
import { productSchema } from '../validations/product.validation';

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = productSchema.parse(req);
    const product = new Product(body);
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

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For updates, you might want a different, more flexible validation schema
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the modified document
      runValidators: true,
    });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch(error) {
    next(error);
  }
};


// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne(); // or product.remove() in older mongoose versions
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};