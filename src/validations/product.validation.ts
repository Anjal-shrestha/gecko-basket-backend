import { z } from 'zod';

export const productSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }),
    description: z.string({ required_error: 'Description is required' }),
    price: z.number({ required_error: 'Price is required' }).positive(),
    image: z.string({ required_error: 'Image URL is required' }),
    brand: z.string({ required_error: 'Brand is required' }),
    category: z.string({ required_error: 'Category is required' }),
    countInStock: z
      .number({ required_error: 'Stock count is required' })
      .int()
      .nonnegative(),
  }),
});