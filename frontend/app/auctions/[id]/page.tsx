"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Clock, User, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuctionCard from "@/components/AuctionCard";
import { useAuctionStore } from "@/stores/useAuctionStore";
import { useCommentStore } from "@/stores/useCommentStore";
import { useUserStore } from "@/stores/useUserStore";
import toast from "react-hot-toast";

export default function AuctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { fetchAuctionById, placeBid } = useAuctionStore();
  const { comments, fetchCommentsByAuction, createCommentForAuction } =
    useCommentStore();
  const { user } = useUserStore();

  const [auction, setAuction] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const a = await fetchAuctionById(id);
        setAuction(a);
        await fetchCommentsByAuction(id);
      } catch (err) {
        console.error("Failed load auction", err);
        toast.error("Erro ao carregar leilão");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isSeller = useMemo(() => {
    if (!user || !auction) return false;
    return user.id === auction.ownerId;
  }, [user, auction]);

  const isEnded = useMemo(() => {
    if (!auction) return false;
    return new Date() > new Date(auction.endTime);
  }, [auction]);

  const nextMinimumBid = useMemo(() => {
    if (!auction) return 0;
    // prefer highest bid + step; store may include bids sorted
    const highest =
      auction.bids && auction.bids.length > 0
        ? Number(auction.bids[0].amount)
        : Number(auction.startingBid ?? 0);
    const step = Math.ceil((highest ?? 0) * 0.02) || 100; // simple step (2% or fallback)
    return highest > 0 ? highest + step : Number(auction.startingBid ?? 0);
  }, [auction]);

  useEffect(() => {
    // sync placeholder nextMinimumBid if auction provides.
    if (auction?.nextMinimumBid) {
      // no-op — we use computed above
    }
  }, [auction]);

  const calculateTimeLeft = () => {
    if (!auction) return "—";
    const diff = new Date(auction.endTime).getTime() - new Date().getTime();
    if (diff <= 0) return "Leilão encerrado";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // realtime-ish timer
  const [timeLeft, setTimeLeft] = useState<string>(calculateTimeLeft());
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auction]);

  const handleBid = async () => {
    if (!auction) return;
    if (isSeller) {
      toast.error("Você é o vendedor deste leilão e não pode dar lances.");
      return;
    }
    if (isEnded) {
      toast.error("Leilão encerrado.");
      return;
    }
    const amount = Number(bidAmount);
    if (!amount || isNaN(amount)) {
      toast.error("Informe um valor válido");
      return;
    }
    if (amount < nextMinimumBid) {
      toast.error(
        `O lance mínimo é ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(nextMinimumBid)}`
      );
      return;
    }

    try {
      const bid = await placeBid(auction.id, amount);
      if (bid) {
        setBidAmount("");
        // refresh auction
        const refreshed = await fetchAuctionById(id);
        setAuction(refreshed);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar lance");
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      const c = await createCommentForAuction(id, commentText.trim());
      if (c) {
        setCommentText("");
        toast.success("Comentário enviado");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar comentário");
    }
  };

  const formatDate = (iso?: string) =>
    iso
      ? new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(iso))
      : "";

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

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Leilão não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/auctions">Leilões</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/auctions?category=${
                  auction.category?.name ?? auction.categoryId
                }`}
              >
                {auction.category?.name ?? auction.categoryId ?? "Categoria"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{auction.title ?? auction.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* images */}
        <div className="space-y-4">
          <div className="relative h-[400px] md:h-[520px] rounded-lg overflow-hidden border">
            <Image
              src={auction.images?.[selectedImage] ?? "/placeholder.svg"}
              alt={auction.title ?? auction.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex gap-2 pb-2">
            {(auction.images ?? []).map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-20 h-20 rounded cursor-pointer overflow-hidden border ${
                  selectedImage === i
                    ? "ring-2 ring-primary"
                    : "border-2 hover:border-primary/80"
                }`}
              >
                <Image
                  src={img}
                  alt={`img ${i}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* details + bid box */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              Leilão
            </Badge>
            {auction.category?.name && (
              <Badge variant="outline">{auction.category.name}</Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
            {auction.title ?? auction.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            {auction.owner && (
              <Link
                href={`/vendedor/${auction.owner.id}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Vendido por {auction.owner.name}
              </Link>
            )}
            {!auction.owner && auction.ownerId && (
              <Link
                href={`/vendedor/${auction.ownerId}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Vendido por {auction.ownerId}
              </Link>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-muted-foreground">Lance atual</p>
                <p className="text-3xl font-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    Number(
                      auction.bids?.[0]?.amount ?? auction.startingBid ?? 0
                    )
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Termina em</p>
                <div className="flex items-center text-amber-600 font-medium">
                  <Clock className="h-4 w-4 mr-1" />
                  {timeLeft}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {(auction.bids ?? []).length} lances
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Lance mínimo: ${new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(nextMinimumBid)}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1"
                  disabled={isSeller || isEnded}
                />
                <Button
                  onClick={handleBid}
                  className="cursor-pointer"
                  disabled={
                    isSeller ||
                    isEnded ||
                    Number(bidAmount) < nextMinimumBid ||
                    !bidAmount
                  }
                >
                  <Gavel className="mr-2 h-5 w-5" />
                  Dar Lance
                </Button>
              </div>
              {isSeller && (
                <p className="text-xs text-muted-foreground">
                  Você é o vendedor deste leilão — não é permitido dar lances.
                </p>
              )}
              {isEnded && (
                <p className="text-xs text-muted-foreground">
                  Leilão encerrado.
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-medium mb-2">Descrição</h2>
            <p className="text-sm text-muted-foreground">
              {auction.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium">Dimensões</h3>
              <p className="text-sm text-muted-foreground">
                {auction.dimensions ?? "—"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Condição</h3>
              <p className="text-sm text-muted-foreground">
                {auction.condition
                  ? auction.condition.charAt(0).toUpperCase() +
                    auction.condition.slice(1).toLowerCase()
                  : "—"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Procedência</h3>
              <p className="text-sm text-muted-foreground">
                {auction.provenance ?? "—"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Lance inicial</h3>
              <p className="text-sm text-muted-foreground">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(auction.startingBid ?? 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Bids + Chat */}
      <Tabs defaultValue="bids" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="bids" className="cursor-pointer">
            Histórico de Lances
          </TabsTrigger>
          <TabsTrigger value="chat" className="cursor-pointer">
            Chat com Vendedor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bids" className="space-y-4">
          <h2 className="text-xl font-medium mb-4">Histórico de Lances</h2>

          {auction.bids && auction.bids.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Usuário</th>
                    <th className="text-left p-3 font-medium">Lance</th>
                    <th className="text-left p-3 font-medium">Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {auction.bids.map((b: any, idx: number) => (
                    <tr key={idx} className="border-t">
                      <td className="p-3">
                        {b.bidder?.name ?? b.bidder ?? "Anônimo"}
                      </td>
                      <td className="p-3">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(b.amount))}
                      </td>
                      <td className="p-3">
                        {formatDate(b.createdAt ?? b.time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm border p-4 rounded-lg">
              Nenhum lance ainda. Seja o primeiro a dar um lance!
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-3 border-b">
              <h2 className="font-medium">Chat com o Vendedor</h2>
            </div>

            <ScrollArea className="h-[380px] p-4">
              {/* comments from comment store */}
              {(comments ?? []).map((c) => {
                const isFromSeller =
                  auction.ownerId && c.userId === auction.ownerId;
                return (
                  <div
                    key={c.id}
                    className={`mb-4 flex gap-3 ${
                      isFromSeller ? "bg-amber-50 p-3 rounded-md" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={c.authorAvatar ?? "/placeholder-user.jpg"}
                        alt={c.author ?? "Usuário"}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {c.author ?? "Usuário"}
                        </span>
                        {isFromSeller && (
                          <Badge className="text-[10px] bg-amber-500 text-white">
                            Vendedor
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{c.content}</p>
                    </div>
                  </div>
                );
              })}
            </ScrollArea>

            <div className="p-3 border-t flex gap-2">
              <Input
                placeholder="Envie uma mensagem..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                disabled={!user}
              />
              <Button
                size="icon"
                onClick={handleSendComment}
                disabled={!user || !commentText.trim()}
                className="cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related auctions */}
      {/* {related.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6">
            Leilões Relacionados
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
            {related.map((a) => (
              <AuctionCard key={a.id} auction={a} />
            ))}
          </div>
        </section>
      )} */}
    </div>
  );
}
