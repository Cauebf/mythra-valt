"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";

import axios from "@/lib/axios";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { formatCurrency } from "@lib/utils";
import CartItem from "@components/CartItem";
import { useUserStore } from "@stores/useUserStore";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CartPage() {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { items, fetchCart, subtotal, clearCart } = useCartStore();
  const { user } = useUserStore();
  const router = useRouter();

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = useMemo(() => subtotal, [subtotal]);

  const handleCheckout = async () => {
    if (!items || items.length === 0) return toast.error("Carrinho vazio");
    try {
      setIsCheckoutLoading(true);
      const payload = items.map((it) => ({
        productId: it.id,
        quantity: it.quantity,
      }));
      const res = await axios.post("/payments/create-checkout-session", {
        items: payload,
      });
      const sessionId =
        res.data.sessionId ?? res.data.id ?? res.data.session_id;

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe não inicializado");
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) toast.error(error.message!);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao iniciar pagamento");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8">
          <h1 className="text-3xl font-serif font-bold mb-6">Seu carrinho</h1>

          {items.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <p className="text-lg mb-4">Seu carrinho está vazio</p>
              <Link href="/products">
                <Button className="cursor-pointer">Explorar produtos</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <div>
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </div>
              </div>

              <div className="space-y-3">
                {items.map((it) => (
                  <CartItem key={it.id} item={it} />
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Link
                  href="/products"
                  className="text-sm text-primary hover:underline"
                >
                  Continuar comprando
                </Link>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:underline cursor-pointer"
                >
                  Limpar carrinho
                </button>
              </div>
            </div>
          )}
        </main>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-4">
            <div className="rounded-lg border bg-white p-6 shadow">
              <h2 className="text-lg font-medium mb-4">Resumo do pedido</h2>

              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatCurrency(total)}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span className="text-sm text-muted-foreground">Envio</span>
                <span className="text-sm text-muted-foreground">Grátis</span>
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <span className="text-lg font-medium">Total</span>
                <span className="text-xl font-bold">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="mt-6 space-y-2">
                <Button
                  className="w-full py-3 cursor-pointer"
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading || items.length === 0}
                >
                  {isCheckoutLoading ? "Redirecionando..." : "Pagar com cartão"}
                </Button>
                <Link href="/products">
                  <Button variant="outline" className="w-full cursor-pointer">
                    Continuar comprando
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Pagamento seguro via Stripe. Seus dados de pagamento não ficam
                no nosso servidor.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
