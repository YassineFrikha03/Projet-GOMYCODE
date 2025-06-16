import Order  from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import handleError from '../middlewares/errors/handleError.js';

const createOrder = async (req, res) => {
    try {

        const existingUser = await User.findById(req.body.user);
        if (!existingUser) {
            return handleError(res, null, "The specified user does not exist", 400);
        }

        const quantityCheck = req.body.products.every(item => item.quantity >= 1);
        if (!quantityCheck) {
            return handleError(res, null, "the quantity must be >=1", 400);
        }

        const productIds = req.body.products.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            return handleError(res, null, "One or more products do not exist", 400);
        }

        const statusCheck = req.body.status && ['pending', 'shipped', 'delivered', 'canceled'].includes(req.body.status);
        if (req.body.status && !statusCheck) {
            return handleError(res, null, "Invalid order status", 400);
        }

        const results = await Promise.all(req.body.products.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} does not exist`);
            }
            return product.price * item.quantity;
        }));
        if (results.some(result => result instanceof Error)) {
            return handleError(res, null, "Error calculating total price for products", 400);
        }
        const totalPrice = results.reduce((sum, price) => sum + price, 0);
        req.body.totalPrice = totalPrice;

        const newOrder = new Order(req.body);
        await newOrder.save();
        return res.status(201).json(newOrder);

    } catch (error) {
        handleError(res, error, error.message || "Error in creating Order", 500);
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('products.product', 'name price');
        return res.status(200).json(orders);
    } catch (error) {
        handleError(res, error, error.message || "Error in fetching Orders", 500);
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('products.product', 'name price');
        if (!order) {
            return handleError(res, null, "Order not found", 404);
        }
        return res.status(200).json(order);
    } catch (error) {
        handleError(res, error, error.message || "Error in fetching Order", 500);
    }
};

const updateOrder = async (req, res) => {
    try {

        const existingUser = await User.findById(order.user);
        if (!existingUser) {
            return handleError(res, null, "The specified user does not exist", 400);
        }
        const quantityCheck = order.products.every(item => item.quantity >= 1);
        if (!quantityCheck) {
            return handleError(res, null, "the quantity must be >=1", 400);
        }
        const products = await Product.find({ _id: { $in: order.products.map(item => item.product) } });
        if (products.length !== order.products.length) {
            return handleError(res, null, "One or more products do not exist", 400);
        }
        const results = await Promise.all(order.products.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} does not exist`);
            }
            return product.price * item.quantity;
        }));
        if (results.some(result => result instanceof Error)) {
            return handleError(res, null, "Error calculating total price for products", 400);
        }

                const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } ).populate('user', 'name email').populate('products.product', 'name price');

        if (!order) {
            return handleError(res, null, "Order not found", 404);
        }
        return res.status(200).json(order);
    } catch (error) {
        handleError(res, error, error.message || "Error in updating Order", 500);
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return handleError(res, null, "Order not found", 404);
        }
        const status = order.status;
        if (status === 'shipped' || status === 'pending') {
            return handleError(res, null, "Cannot delete an order that has been shipped or pending", 400);
        }
        return res.status(204).send();
    } catch (error) {
        handleError(res, error, error.message || "Error in deleting Order", 500);
    }
};

const getOrderByIdUser = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return handleError(res, null, "Missing userId in query", 400);
        }

        const orders = await Order.find({ user: userId });

        if (!orders || orders.length === 0) {
            return handleError(res, null, "No orders found for this user", 404);
        }

        return res.status(200).json(orders);
    } catch (error) {
        return handleError(res, error, error.message || "Error while fetching orders");
    }
};

const getOrderByStatus = async (req, res) => {
    try {
        const status = req.query.status;
        const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
        if (!validStatuses.includes(status)) {
            return handleError(res, null, "Invalid order status", 400);
        }
        const orders = await Order.find({ status }).populate('user', 'name email').populate('products.product', 'name price');
        return res.status(200).json(orders);
    } catch (error) {
        handleError(res, error, error.message || "Error in fetching Orders by status", 500);
    }
};




export default {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrderByIdUser,
    getOrderByStatus
};

