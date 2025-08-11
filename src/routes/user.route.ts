import express from 'express';
import {
  getUserProfile,
  updateUserProfile,  // 1. Import the new functions
  changeUserPassword,
} from '../controllers/user.controller';
import {
  getAddresses, // 1. Import the new address functions
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/address.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes in this file are for logged-in users, so we protect them all
router.use(protect);

// 2. Add the new PUT route for updating profile details
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// 3. Add the new route for changing the password
router.route('/change-password').put(changeUserPassword);
router.route('/addresses')
  .get(getAddresses)
  .post(addAddress);

router.route('/addresses/:id')
  .put(updateAddress)
  .delete(deleteAddress);

export default router;