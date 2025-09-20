import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../controllers/cart.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, getCart);
router.post("/", protectedRoute, addToCart);
router.delete("/", protectedRoute, clearCart);
router.delete("/:productId", protectedRoute, removeFromCart);
router.put("/:productId", protectedRoute, updateCartQuantity);

export default router;
