import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", protectedRoute, adminRoute, createCategory);
router.patch("/:id", protectedRoute, adminRoute, updateCategory);
router.delete("/:id", protectedRoute, adminRoute, deleteCategory);

export default router;
