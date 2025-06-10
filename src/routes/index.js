import { Router } from 'express';
import exampleRoutes from './example.route.js';
import userRoutes from './user.route.js';
import categoriesRoutes from './category.route.js';
import productRoutes from './product.route.js';
import orderRoutes from './order.route.js';
import authRoutes from './authentication.route.js';
import   isAuth  from '../middlewares/auth.middlewares.js';


const router = Router();
router.use('/examples', isAuth, exampleRoutes);
router.use('/users',isAuth, userRoutes);
router.use('/category', isAuth, categoriesRoutes);
router.use('/product', isAuth ,productRoutes);
router.use('/order',  orderRoutes);
router.use('/auth', authRoutes);

export default router;