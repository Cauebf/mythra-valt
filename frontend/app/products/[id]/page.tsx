"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Truck, Shield, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/stores/useProductStore";
import { useReviewStore } from "@/stores/useReviewStore";
import { useCartStore } from "@/stores/useCartStore";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useUserStore } from "@/stores/useUserStore";
import toast from "react-hot-toast";
import type { Product } from "@types";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const { getProductById, products, fetchProductsByCategory } =
    useProductStore();
  const { reviews, fetchReviewsByProduct, createReview } = useReviewStore();
  const { addToCart } = useCartStore();
  const { toggleFavorite, fetchUserFavorites, isFavoriteForProduct } =
    useFavoriteStore();
  const { fetchAllCategories } = useCategoryStore();
  const { user } = useUserStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [related, setRelated] = useState<Product[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchAllCategories();
        const p = await getProductById(id);
        setProduct(p ?? null);

        if (p?.categoryId) {
          await fetchProductsByCategory(p.categoryId);
          const relatedCandidates = (products || []).filter(
            (x) => x.id !== p.id && x.categoryId === p.categoryId
          );
          setRelated(relatedCandidates.slice(0, 8));
        }

        await fetchReviewsByProduct(id);
        await fetchUserFavorites();
      } catch (err) {
        console.error("Error loading product page", err);
        toast.error("Erro ao carregar o produto");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // compute averages from reviews loaded for this product
  const reviewCount = useMemo(() => {
    if (reviews && reviews.length > 0) return reviews.length;
    return product?._count?.reviews ?? 0;
  }, [reviews, product]);

  const avgRating = useMemo(() => {
    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
      return sum / reviews.length;
    }
    // fallback to product.avgRating if backend provided it
    return product && (product as any).avgRating
      ? Number((product as any).avgRating)
      : 0;
  }, [reviews, product]);

  const isSeller = useMemo(() => {
    if (!product || !user) return false;
    return user.id === product.ownerId || user.id === product.owner?.id;
  }, [product, user]);

  const increment = () => {
    if (!product) return;
    if (quantity < (product.quantity ?? 1)) setQuantity((q) => q + 1);
  };
  const decrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = async () => {
    if (!product || !product.id) return;
    if (isSeller) {
      toast.error(
        "Você é o vendedor — não é possível adicionar seu próprio produto ao carrinho."
      );
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success("Adicionado ao carrinho");
      router.push("/cart");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar ao carrinho");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!product || !product.id) return;
    setFavLoading(true);
    try {
      await toggleFavorite(product.id);
      toast.success("Favorito atualizado");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar favorito");
    } finally {
      setFavLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!product || !product.id) return;
    if (isSeller) {
      toast.error("Vendedores não podem avaliar seu próprio produto.");
      return;
    }
    if (userRating === 0 || !userComment.trim()) {
      toast.error("Selecione avaliação e escreva um comentário");
      return;
    }
    try {
      const r = await createReview(product.id, userRating, userComment);
      if (r) {
        setUserRating(0);
        setUserComment("");
        toast.success("Avaliação enviada");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar avaliação");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-100 rounded" />
          <div className="h-6 bg-gray-100 rounded w-64" />
          <div className="h-6 bg-gray-100 rounded w-40" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Produtos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/products?category=${product.categoryId}`}>
              {product.category?.name ?? "Categoria"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{product.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative h-[400px] md:h-[520px] rounded-lg overflow-hidden border">
            <Image
              src={product.images?.[selectedImageIdx] ?? "/placeholder.svg"}
              alt={product.title ?? "produto"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex gap-2 pb-2">
            {(product.images || []).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIdx(i)}
                className={`relative w-20 h-20 rounded cursor-pointer overflow-hidden border ${
                  selectedImageIdx === i
                    ? "ring-2 ring-primary"
                    : "border-2 hover:border-primary/80"
                }`}
              >
                <Image
                  src={img}
                  alt={`img-${i}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.era && <Badge variant="outline">{product.era}</Badge>}
            {product.condition && (
              <Badge variant="outline">
                {product.condition.charAt(0).toUpperCase() +
                  product.condition.slice(1).toLowerCase()}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(avgRating) ? "fill-current" : "fill-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} avaliações)
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/user/${product.ownerId}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Vendido por {product.owner?.name ?? "Vendedor"}
            </Link>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold mb-1">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price ?? 0)}
            </p>
            <p className="text-sm text-muted-foreground">
              Em até 12x sem juros
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm mb-4">{product.description}</p>

            {/* Show important details explicitly (origem, dimensões, material, autenticidade) */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">Origem</p>
                <p className="text-sm text-muted-foreground">
                  {product.origin ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Dimensões</p>
                <p className="text-sm text-muted-foreground">
                  {product.dimensions ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Material</p>
                <p className="text-sm text-muted-foreground">
                  {product.material ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Autenticidade</p>
                <p className="text-sm text-muted-foreground">
                  {product.authenticity
                    ? product.authenticity.charAt(0).toUpperCase() +
                      product.authenticity.slice(1).toLowerCase()
                    : "Desconhecida"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(product.specifications ?? []).map((spec, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium">{spec.name}</p>
                  <p className="text-sm text-muted-foreground">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <p className="font-medium">Quantidade:</p>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrement}
                  disabled={quantity <= 1}
                  className="cursor-pointer"
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increment}
                  disabled={quantity >= (product.quantity ?? 1)}
                  className="cursor-pointer"
                >
                  +
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {product.quantity ?? 0} disponível
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 cursor-pointer"
                size="lg"
                onClick={handleAddToCart}
                disabled={addingToCart || isSeller}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isSeller
                  ? "Você é o vendedor"
                  : addingToCart
                  ? "Adicionando..."
                  : "Adicionar ao Carrinho"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="shrink-0 cursor-pointer"
                onClick={handleToggleFavorite}
                disabled={favLoading}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavoriteForProduct(product.id!)
                      ? "text-red-500 fill-red-500"
                      : ""
                  }`}
                />
                <span className="sr-only">Favoritar</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <p>Frete grátis para todo o Brasil</p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <p>Garantia de autenticidade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6">
            Produtos Relacionados
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">
          Avaliações e Comentários
        </h2>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-8">
          <div className="bg-muted p-6 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(avgRating) ? "fill-current" : "fill-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Baseado em {reviewCount} avaliações
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Adicionar avaliação</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sua avaliação
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="text-amber-500 cursor-pointer hover:text-amber-500/80"
                      aria-label={`Avaliar ${star}`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= userRating ? "fill-amber-500" : "fill-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Seu comentário
                </label>
                <textarea
                  rows={4}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder={
                    isSeller
                      ? "Vendedores não podem avaliar seu próprio produto."
                      : "Compartilhe sua experiência..."
                  }
                  disabled={isSeller}
                />
              </div>

              <Button onClick={handleSubmitReview} className="cursor-pointer" disabled={isSeller}>
                Enviar avaliação
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={r.authorAvatar ?? "/placeholder-user.jpg"}
                        alt={r.author}
                      />
                      <AvatarFallback>{r.author?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{r.author}</span>
                  </div>
                  <div className="flex mt-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < r.rating ? "fill-current" : "fill-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2">{r.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
