import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ category });
  } catch (error) {
    console.error("Error getting category by id:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { name } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Invalid category name" });
    }

    // avoid duplicates
    const exists = await prisma.category.findUnique({ where: { name } });
    if (exists) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = await prisma.category.create({
      data: { name: name.trim() },
    });

    res.status(201).json({ category });
  } catch (error) {
    console.error("Error creating category:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Invalid category name" });
    }

    // check duplicate name
    const conflicting = await prisma.category.findUnique({ where: { name } });
    if (conflicting && conflicting.id !== id) {
      return res
        .status(409)
        .json({ message: "Another category with that name already exists" });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });

    res.status(200).json({ category: updated });
  } catch (error) {
    console.error("Error updating category:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Optional: prevent deletion if there are products/auctions attached
    const attachedProducts = await prisma.product.count({
      where: { categoryId: id },
    });
    const attachedAuctions = await prisma.auction.count({
      where: { categoryId: id },
    });

    if (attachedProducts > 0 || attachedAuctions > 0) {
      return res.status(400).json({
        message: "Cannot delete category with attached products or auctions",
      });
    }

    await prisma.category.delete({ where: { id } });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};
