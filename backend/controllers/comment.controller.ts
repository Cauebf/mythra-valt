import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getCommentsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!content) return res.status(400).json({ message: "Missing content" });

    const comment = await prisma.comment.create({
      data: { content, userId, productId },
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
