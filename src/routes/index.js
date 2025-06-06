import { Router } from 'express';
import exampleRoutes from './example.route.js';
import userRoutes from './user.route.js';
import categoriesRoutes from './category.route.js';
import productRoutes from './product.route.js';

const router = Router();
router.use('/examples', exampleRoutes);
router.use('/users', userRoutes);
router.use('/category', categoriesRoutes);
router.use('/product', productRoutes);

export default router;