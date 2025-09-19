import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, getCart);
router.post("/", protectedRoute, addToCart);
router.delete("/:id", protectedRoute, removeFromCart);

export default router;
