"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AuctionCard from "@/components/AuctionCard";
import { useAuctionStore } from "@/stores/useAuctionStore";

export default function AuctionsPage() {
  const {
    auctions,
    fetchAllAuctions,
    loading: storeLoading,
  } = useAuctionStore();

  // UI State
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<
    "all" | "active" | "ending-soon" | "upcoming"
  >("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("ending-soon");
  const [sheetOpen, setSheetOpen] = useState(false);

  const searchRef = useRef<number | null>(null);

  useEffect(() => {
    fetchAllAuctions();
  }, []);

  // derive facets from auctions (categories, price range)
  const facets = useMemo(() => {
    const cats = new Set<string>();
    let min = Number.POSITIVE_INFINITY;
    let max = 0;

    for (const a of auctions) {
      const catName = (a as any)?.category?.name ?? a.categoryId ?? "";
      if (catName) cats.add(catName);

      const price = (a as any)?.startingBid ?? (a as any)?.currentBid ?? 0;
      const numeric =
        typeof price === "string" ? parseFloat(price) : price ?? 0;
      if (!Number.isNaN(numeric)) {
        min = Math.min(min, numeric);
        max = Math.max(max, numeric);
      }
    }
    if (!isFinite(min)) min = 0;
    if (max === 0) max = 10000;

    return {
      categories: Array.from(cats).sort(),
      priceMin: Math.floor(min),
      priceMax: Math.ceil(max),
    };
  }, [auctions]);

  // filter + sorting
  const filteredAuctions = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();

    return auctions
      .filter((a) => {
        // category
        if (category && category !== "all") {
          const catName = (a as any)?.category?.name ?? a.categoryId ?? "";
          if (!catName || catName !== category) return false;
        }

        // status
        if (status !== "all") {
          const start = new Date(a.startTime);
          const end = new Date(a.endTime);
          if (status === "active" && !(now >= start && now <= end))
            return false;
          if (status === "upcoming" && !(now < start)) return false;
          if (status === "ending-soon") {
            // ending soon = ends in next 48 hours
            const diff = end.getTime() - now.getTime();
            if (diff <= 0 || diff > 48 * 60 * 60 * 1000) return false;
          }
        }

        // price min/max (use highest bid if exists, otherwise startingBid)
        const highestBid =
          (a as any)?.bids && (a as any).bids.length > 0
            ? (a as any).bids[0].amount
            : null;
        const basePrice = highestBid ?? a.startingBid ?? 0;
        const numericPrice =
          typeof basePrice === "string" ? parseFloat(basePrice) : basePrice;

        if (minPrice) {
          const minN = Number(minPrice);
          if (!Number.isNaN(minN) && numericPrice < minN) return false;
        }
        if (maxPrice) {
          const maxN = Number(maxPrice);
          if (!Number.isNaN(maxN) && numericPrice > maxN) return false;
        }

        // search
        if (q) {
          const title = (a.title ?? "").toLowerCase();
          const desc = (a.description ?? "").toLowerCase();
          if (!title.includes(q) && !desc.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "ending-soon": {
            const aEnd = new Date(a.endTime).getTime();
            const bEnd = new Date(b.endTime).getTime();
            return aEnd - bEnd;
          }
          case "price-asc": {
            const aPrice = Number(
              (a as any)?.bids?.[0]?.amount ?? a.startingBid ?? 0
            );
            const bPrice = Number(
              (b as any)?.bids?.[0]?.amount ?? b.startingBid ?? 0
            );
            return (aPrice || 0) - (bPrice || 0);
          }
          case "price-desc": {
            const aPrice = Number(
              (a as any)?.bids?.[0]?.amount ?? a.startingBid ?? 0
            );
            const bPrice = Number(
              (b as any)?.bids?.[0]?.amount ?? b.startingBid ?? 0
            );
            return (bPrice || 0) - (aPrice || 0);
          }
          case "most-bids": {
            const aCount = (a as any)?.bids?.length ?? 0;
            const bCount = (b as any)?.bids?.length ?? 0;
            return bCount - aCount;
          }
          case "newest": {
            return (
              new Date(b.createdAt ?? "").getTime() -
              new Date(a.createdAt ?? "").getTime()
            );
          }
          default:
            return 0;
        }
      });
  }, [auctions, category, status, minPrice, maxPrice, search, sortBy]);

  // handlers
  const resetFilters = () => {
    setCategory("");
    setStatus("all");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSortBy("ending-soon");
  };

  const onSearchChange = (v: string) => {
    if (searchRef.current) window.clearTimeout(searchRef.current);
    searchRef.current = window.setTimeout(() => setSearch(v), 300);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-72 shrink-0 bg-white/60 border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Filtros</h3>
            <button
              aria-label="Limpar"
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={resetFilters}
            >
              Limpar
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="mb-2">Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    Todas as categorias
                  </SelectItem>
                  {facets.categories.map((c) => (
                    <SelectItem key={c} value={c} className="cursor-pointer">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <Label className="mb-2">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Todos os leilões" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    Todos
                  </SelectItem>
                  <SelectItem value="active" className="cursor-pointer">
                    Ativos
                  </SelectItem>
                  <SelectItem value="ending-soon" className="cursor-pointer">
                    Terminando em breve
                  </SelectItem>
                  <SelectItem value="upcoming" className="cursor-pointer">
                    Agendados
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <Label className="mb-2">Faixa de Preço</Label>
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="min-price" className="mb-2 text-sm">
                    Preço mínimo
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder={`R$ ${facets.priceMin}`}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="max-price" className="mb-2 text-sm">
                    Preço máximo
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder={`R$ ${facets.priceMax}`}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={resetFilters}
            >
              Limpar filtros
            </Button>
          </div>
        </aside>

        {/* Mobile filter sheet */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <div className="md:hidden mb-4 flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar leilões..."
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <SheetTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
          </div>

          <SheetContent side="left" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Filtros</h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="mb-2">Categoria</Label>
                <Select value={category} onValueChange={(v) => setCategory(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {facets.categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os leilões" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="ending-soon">
                      Terminando em breve
                    </SelectItem>
                    <SelectItem value="upcoming">Agendados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Faixa de Preço</Label>
                <div className="grid gap-3">
                  <Input
                    placeholder={`Mín R$ ${facets.priceMin}`}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    placeholder={`Máx R$ ${facets.priceMax}`}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                Limpar filtros
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold mb-1">Leilões</h1>
              <p className="text-muted-foreground">
                {filteredAuctions.length} leilões encontrados
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden md:block w-[360px]">
                <Input
                  placeholder="Buscar leilões..."
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending-soon" className="cursor-pointer">
                      Terminando em breve
                    </SelectItem>
                    <SelectItem value="price-asc" className="cursor-pointer">
                      Menor Lance
                    </SelectItem>
                    <SelectItem value="price-desc" className="cursor-pointer">
                      Maior Lance
                    </SelectItem>
                    <SelectItem value="most-bids" className="cursor-pointer">
                      Mais Lances
                    </SelectItem>
                    <SelectItem value="newest" className="cursor-pointer">
                      Mais recentes
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {storeLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white/60 rounded-lg h-56 border"
                />
              ))}
            </div>
          ) : filteredAuctions.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">
                Nenhum leilão encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar seus filtros ou buscar por outro termo.
              </p>
              <Button onClick={resetFilters} className="cursor-pointer">
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
