"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Product } from "@types";

export default function ProductCard({ product }: { product?: Product | null }) {
  // fallback values when product is undefined or missing fields
  const id = product?.id ?? "0";
  const name = product?.title ?? "Item sem título";
  const priceRaw = (product?.price as any) ?? 0;
  const price =
    typeof priceRaw === "string" ? parseFloat(priceRaw) : priceRaw ?? 0;
  const images = product?.images ?? [];
  const image = images.length > 0 ? images[0] : "/placeholder.svg";
  const category =
    (product as any)?.category?.name ?? product?.categoryId ?? "";
  // optional fields (not in schema by default)
  const discount = (product as any)?.discount ?? 0;
  const rating = (product as any)?.rating ?? 0;
  const reviewCount =
    (product as any)?.reviewCount ?? (product as any)?.reviews?.length ?? 0;

  // formatted price
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  const originalPrice = discount ? price / (1 - discount / 100) : null;

  return (
    <div className="group">
      <Link href={`/products/${id}`} className="block h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-2 rounded-md border">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />

          {category && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="text-xs bg-white/90 text-gray-700 hover:bg-white/90"
              >
                {category}
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3
            className="text-sm text-gray-900 line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap"
            title={name}
          >
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? "fill-amber-400 text-amber-400"
                      : i < rating
                      ? "fill-amber-400/50 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              {discount ? (
                <span className="text-sm text-red-600 font-medium">
                  -{discount}%
                </span>
              ) : null}
              <span className="text-lg font-medium text-gray-900">
                {formattedPrice}
              </span>
            </div>

            {originalPrice ? (
              <div className="text-sm text-gray-500">
                De:{" "}
                <span className="line-through">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(originalPrice)}
                </span>
              </div>
            ) : null}

            <p className="text-xs text-foreground/70">Frete grátis</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
