import express from "express";
import {
  toggleFavorite,
  getUserFavorites,
} from "../controllers/favorite.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:productId", protectedRoute, toggleFavorite);
router.get("/", protectedRoute, getUserFavorites);

export default router;
