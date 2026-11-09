import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { listCustomers, createCustomer, getCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
const router = Router();
router.use(protect);
router.route('/').get(listCustomers).post(createCustomer);
router.route('/:id').get(getCustomer).put(updateCustomer).delete(deleteCustomer);
export default router;