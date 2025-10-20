"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import clsx from "clsx";
import { formatCurrency } from "@lib/utils";

type Props = {
  item: {
    id: string;
    title: string;
    price: number;
    images?: string[];
    quantity: number;
    stock?: number;
  };
};

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeFromCart, pendingIds } = useCartStore();

  const isPending = pendingIds.includes(item.id);
  const reachedStockLimit =
    typeof item.stock === "number" && item.quantity >= (item.stock ?? 0);

  return (
    <div className="flex gap-4 p-4 rounded-lg border bg-white shadow-sm">
      <div className="w-28 h-28 rounded overflow-hidden bg-gray-50 relative flex-shrink-0">
        <Image
          src={item.images?.[0] ?? "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <a
          className="block font-medium text-lg line-clamp-2"
          href={`/products/${item.id}`}
        >
          {item.title}
        </a>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-md border overflow-hidden">
              <button
                className="px-3 py-2 disabled:opacity-50 cursor-pointer"
                onClick={() =>
                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
                aria-label="Diminuir quantidade"
                disabled={isPending}
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className={clsx("px-4 py-2 text-center min-w-[52px]")}>
                {item.quantity}
              </div>

              <button
                className="px-3 py-2 cursor-pointer disabled:opacity-50"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label="Aumentar quantidade"
                disabled={isPending || reachedStockLimit}
                title={
                  reachedStockLimit
                    ? "Atingiu o limite em estoque"
                    : "Aumentar quantidade"
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-sm text-red-600 hover:underline flex items-center gap-2 cursor-pointer"
              aria-label="Remover item"
              disabled={isPending}
            >
              <Trash className="w-4 h-4" /> Remover
            </button>
          </div>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Unitário</div>
            <div className="font-semibold text-lg">
              {formatCurrency(item.price)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Total: {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
