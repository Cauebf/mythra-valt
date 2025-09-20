import { Request, Response } from "express";
import { prisma } from "../lib/db";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    const items = (cart?.items ?? []).map((it) => ({
      product: {
        id: it.product.id,
        title: it.product.title,
        price: Number(it.product.price),
        images: it.product.images,
      },
      quantity: it.quantity,
    }));

    return res.json({ items });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao buscar carrinho" });
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req?.user?.id;
    const { productId, quantity = 1 } = req.body;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    // garante que cart exista
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // verifica item existente
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart?.id, productId },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Number(quantity) },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart?.id,
          productId,
          quantity: Number(quantity),
        },
      });
    }

    // retorna cart atualizado
    const updated = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    return res.json({ items: updated?.items ?? [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao adicionar ao carrinho" });
  }
};

export const removeFromCart = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req?.user?.id;
    const productId = req.params.productId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart)
      return res.status(400).json({ message: "Carrinho não encontrado" });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    const updated = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    return res.json({ items: updated?.items ?? [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao remover do carrinho" });
  }
};

export const updateCartQuantity = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req?.user?.id;
    const productId = req.params.productId;
    const { quantity } = req.body;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });
    if (!cart)
      return res.status(400).json({ message: "Carrinho não encontrado" });

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });
    if (!existing)
      return res.status(404).json({ message: "Item não encontrado" });

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: existing.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: Number(quantity) },
      });
    }

    const updated = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    return res.json({ items: updated?.items ?? [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao atualizar quantidade" });
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart)
      return res.status(400).json({ message: "Carrinho não encontrado" });

    // Apaga todos os itens do carrinho
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return res.json({ message: "Carrinho limpo com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao limpar carrinho" });
  }
};
