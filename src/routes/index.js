import { Router } from 'express';
import exampleRoutes from './example.route.js';
import userRoutes from './user.route.js';
import categoriesRoutes from './category.route.js';
import productRoutes from './product.route.js';
import orderRoutes from './order.route.js';
import authRoutes from './authentication.route.js';
import   isAuth  from '../middlewares/auth.middlewares.js';
import isAdmin from '../middlewares/admin.middleware.js';



const router = Router();
router.use('/examples', isAuth ,isAdmin,exampleRoutes);
router.use('/users'  ,isAuth,isAdmin,userRoutes);
router.use('/category',isAuth,isAdmin, categoriesRoutes);
router.use('/product',isAuth ,isAdmin,productRoutes);
router.use('/order',isAuth,isAdmin,orderRoutes);
router.use('/auth', authRoutes);
router.use('/admin', userRoutes);


export default router;