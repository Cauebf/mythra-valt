"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import axios from "@/lib/axios";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CartPage() {
  const { items, fetchCart, updateQuantity, removeFromCart, subtotal } =
    useCartStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = useMemo(() => {
    return subtotal;
  }, [subtotal]);

  const handleCheckout = async () => {
    if (items.length === 0) return toast.error("Carrinho vazio");
    try {
      setLoading(true);
      const res = await axios.post("/payments/create-checkout-session", {
        items: items.map((it) => ({ productId: it.id, quantity: it.quantity })),
      });
      const { sessionId } = res.data;
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe não inicializado");
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) toast.error(error.message!);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao iniciar pagamento");
    } finally {
      setLoading(false);
    }
  };

  if (!items) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold mb-6">Carrinho</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="mb-4">Seu carrinho está vazio.</p>
          <Link href="/products">
            <Button>Continuar comprando</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex gap-4 items-center border rounded p-4"
              >
                <div className="relative w-28 h-28 bg-gray-50 overflow-hidden rounded">
                  <Image
                    src={it.images?.[0] ?? "/placeholder.svg"}
                    alt={it.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">{it.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(it.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(it.id, Math.max(1, it.quantity - 1))
                    }
                    className="p-2 rounded border"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-10 text-center">{it.quantity}</div>
                  <button
                    onClick={() => updateQuantity(it.id, it.quantity + 1)}
                    className="p-2 rounded border"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(it.price * it.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(it.id)}
                    className="mt-2 text-sm text-red-600"
                  >
                    <Trash className="inline-block mr-1" /> Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="border rounded p-4">
              <p className="text-sm text-muted-foreground">Resumo do pedido</p>
              <div className="flex justify-between mt-2">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(total)}
                </span>
              </div>

              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "Redirecionando..." : "Pagar com cartão"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Pagamento seguro via Stripe. Sem frete nem cupons.
                </p>
              </div>
            </div>

            <Link href="/products">
              <Button variant="outline" className="w-full">
                Continuar comprando
              </Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
