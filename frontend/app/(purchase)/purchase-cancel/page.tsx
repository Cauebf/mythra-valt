"use client";

import React from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PurchaseCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold mt-4">Pagamento cancelado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seu pagamento foi cancelado. Nenhuma cobrança foi realizada.
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <Link href="/cart">
            <Button variant="outline" className="cursor-pointer">
              Voltar ao carrinho
            </Button>
          </Link>
          <Link href="/products">
            <Button className="cursor-pointer">Continuar comprando</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
