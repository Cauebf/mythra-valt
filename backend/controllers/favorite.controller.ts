import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const toggleFavorite = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const existing = await prisma.favorite.findFirst({
      where: { productId, userId },
    });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.status(200).json({ removed: true });
    } else {
      const fav = await prisma.favorite.create({ data: { productId, userId } });
      return res.status(201).json({ favorite: fav });
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getUserFavorites = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { product: true },
    });
    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
