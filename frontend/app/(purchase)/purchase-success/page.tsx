"use client";

import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PurchaseSuccessPage() {
  const [processing, setProcessing] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { clearCartLocal } = useCartStore();

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (!sessionId) {
      setProcessing(false);
      toast.error("Session ID ausente");
      return;
    }

    (async () => {
      try {
        const res = await axios.post("/payments/checkout-success", {
          sessionId,
        });
        setOrderId(res.data.orderId ?? null);
        // esvazia localmente o cart
        clearCartLocal();
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Falha ao processar pagamento"
        );
      } finally {
        setProcessing(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Processando seu pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Confetti numberOfPieces={400} recycle={false} />
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="text-2xl font-bold mt-4">Pagamento concluído</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Obrigado! Seu pedido foi confirmado.
          </p>
          {orderId && (
            <p className="mt-2 text-sm">
              Número do pedido: <strong>#{orderId}</strong>
            </p>
          )}
          <div className="mt-6 flex gap-2 justify-center">
            <Link href="/">
              <Button className="cursor-pointer">Continuar comprando</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
