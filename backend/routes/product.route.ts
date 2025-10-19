import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
} from "../controllers/product.controller.js";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.get("/category/:category", getProductsByCategory);
router.post("/", protectedRoute, createProduct);
router.delete("/:id", protectedRoute, adminRoute, deleteProduct);

export default router;
