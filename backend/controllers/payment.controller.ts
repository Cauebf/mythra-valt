import { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import { stripe } from "../lib/stripe.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export const createCheckoutSession = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Itens inválidos" });
    }

    // fetch product data
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // build line_items
    const line_items = items.map((it: any) => {
      const p = products.find((x: { id: any }) => x.id === it.productId);
      if (!p) throw new Error("Produto não encontrado: " + it.productId);
      const unit_amount = Math.round(Number(p.price) * 100);
      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: p.title,
            images: (p.images ?? []).slice(0, 1),
          },
          unit_amount,
        },
        quantity: Number(it.quantity || 1),
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      metadata: {
        userId,
        items: JSON.stringify(items),
      },
    });

    return res.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("createCheckoutSession error", err);
    return res
      .status(500)
      .json({ message: err?.message ?? "Erro ao criar sessão" });
  }
};

export const checkoutSuccess = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId)
      return res.status(400).json({ message: "sessionId ausente" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session)
      return res.status(404).json({ message: "Sessão não encontrada" });
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Pagamento não confirmado" });
    }

    const metadata = session.metadata || {};
    const userId = metadata.userId ?? req?.user?.id;
    const items = JSON.parse(metadata.items || "[]");

    // avoid duplicate order for same stripe session
    const existing = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
    });
    if (existing) {
      return res.json({ orderId: existing.id });
    }

    // create Order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: Number((session.amount_total ?? 0) / 100),
        stripeSessionId: sessionId,
      },
    });

    // create OrderItems
    for (const it of items) {
      const product = await prisma.product.findUnique({
        where: { id: it.productId },
      });
      if (!product) continue;
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          price: Number(product.price),
          quantity: Number(it.quantity),
        },
      });
      // Optionally decrement product.quantity stock if you manage inventory
      // await prisma.product.update({ where: { id: product.id }, data: { quantity: { decrement: Number(it.quantity) } } });
    }

    // clear user's cart
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return res.json({ orderId: order.id });
  } catch (err) {
    console.error("checkoutSuccess error", err);
    return res
      .status(500)
      .json({ message: "Erro ao processar checkout success" });
  }
};
