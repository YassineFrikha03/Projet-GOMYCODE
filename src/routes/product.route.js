import productController from "../controllers/product.controller.js";
import express from "express";
const router = express.Router();

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/category", productController.getProductsByCategoryId);
router.get("/:id", productController.getProductById);   
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;