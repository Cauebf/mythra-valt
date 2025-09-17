"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    discount?: number;
    rating?: number;
    reviewCount?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    name,
    price,
    image,
    category,
    discount,
    rating = 4.5,
    reviewCount = 0,
  } = product;

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  const originalPrice = discount ? price / (1 - discount / 100) : null;

  return (
    <div className="group">
      <Link href={`/products/${id}`} className="block h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-2">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
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
          <h3 className="text-sm text-gray-900 line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
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
            <span className="text-xs text-blue-600">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              {discount && (
                <span className="text-lg text-red-600 font-light">
                  -{discount}%
                </span>
              )}
              <span className="text-lg font-normal text-gray-900">
                {formattedPrice}
              </span>
            </div>
            {originalPrice && (
              <div className="text-sm text-gray-500">
                De:{" "}
                <span className="line-through">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(originalPrice)}
                </span>
              </div>
            )}
            <p className="text-xs text-gray-600">Frete GRÁTIS</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
