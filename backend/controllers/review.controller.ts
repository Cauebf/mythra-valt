import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const createReview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { rating, content } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!rating || !content)
      return res.status(400).json({ message: "Missing fields" });

    // enforce one review per user per product (your schema enforces it too)
    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });
    if (existing) {
      // update instead
      const updated = await prisma.review.update({
        where: { id: existing.id },
        data: { rating: Number(rating), content },
      });
      return res.status(200).json({ review: updated });
    }

    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        content,
        userId,
        productId,
      },
    });

    // Optionally update product aggregated fields (avgRating / counts)
    // You can compute aggregates when querying or maintain denormalized fields.

    res.status(201).json({ review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
