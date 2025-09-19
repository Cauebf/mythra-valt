import express from "express";
import {
  createReview,
  getReviewsByProduct,
} from "../controllers/review.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, createReview);
router.get("/product/:productId", getReviewsByProduct);

export default router;
