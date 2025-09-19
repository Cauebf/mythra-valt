import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }
    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!productId || !quantity)
      return res.status(400).json({ message: "Missing fields" });

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Number(quantity) },
      });
      return res.status(200).json({ item: updated });
    } else {
      const item = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: Number(quantity) },
      });
      return res.status(201).json({ item });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const removeFromCart = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true } } },
    });
    res.status(200).json({ cart: updated });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
