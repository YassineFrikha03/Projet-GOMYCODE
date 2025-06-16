import express from 'express';
import orderController from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/bystatus', orderController.getOrderByStatus); // ghalet fel query mouch fi path
router.get('/byuser', orderController.getOrderByIdUser); // ghalet fel query mouch fi path
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

export default router;