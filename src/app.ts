import dotenv from 'dotenv';
dotenv.config();
import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ZodError } from 'zod';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import adminRouter from './routes/admin.route';
import productRouter from './routes/product.route'; 
import OrderRouter from './routes/order.route'; // Assuming you have an order route set up
const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', OrderRouter); // Assuming you have an order route set up
// Test Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the Gecko-Basket API!' });
});

// === Global Error Handler ===
// Define the error handler as a separate, typed constant.
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  if (err instanceof ZodError) {
    // Correct: No 'return' statement here.
    res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ path: e.path, message: e.message })),
    });
    // No 'next()' is needed after sending a response.
    return; // You can add a return to exit the function early.
  }

  res.status(500).json({
    message: 'An internal server error occurred',
  });
};

// Use the typed error handler. This MUST be the last `app.use()` call.
app.use(globalErrorHandler);

export default app;