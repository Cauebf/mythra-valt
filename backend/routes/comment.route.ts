import express from "express";
import {
  getCommentsByProduct,
  createComment,
} from "../controllers/comment.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/product/:productId", getCommentsByProduct);
router.post("/", protectedRoute, createComment);

export default router;
