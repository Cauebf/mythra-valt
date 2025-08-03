"use client";

import type React from "react";

import { useState } from "react";
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
import { auctions } from "@/lib/placeholder-data";

export default function AuctionsPage() {
  const [filters, setFilters] = useState({
    category: "",
    status: "all",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  const [sortBy, setSortBy] = useState("ending-soon");

  // Filtrar leilões com base nos filtros selecionados
  const filteredAuctions = auctions.filter((auction) => {
    // Filtro por categoria
    if (filters.category && auction.category !== filters.category) {
      return false;
    }

    // Filtro por status
    if (filters.status !== "all" && auction.status !== filters.status) {
      return false;
    }

    // Filtro por preço mínimo
    if (filters.minPrice && auction.currentBid < Number(filters.minPrice)) {
      return false;
    }

    // Filtro por preço máximo
    if (filters.maxPrice && auction.currentBid > Number(filters.maxPrice)) {
      return false;
    }

    // Filtro por busca
    if (
      filters.search &&
      !auction.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Ordenar leilões
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortBy) {
      case "ending-soon":
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      case "price-asc":
        return a.currentBid - b.currentBid;
      case "price-desc":
        return b.currentBid - a.currentBid;
      case "most-bids":
        return b.bids - a.bids;
      default:
        return 0;
    }
  });

  const categories = [
    "Móveis",
    "Arte",
    "Joias",
    "Livros",
    "Relógios",
    "Porcelana",
    "Numismática",
  ];

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, minPrice: e.target.value });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, maxPrice: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      status: "all",
      minPrice: "",
      maxPrice: "",
      search: "",
    });
    setSortBy("ending-soon");
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Categorias</h3>
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-foreground">
              Todas as categorias
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Status</h3>
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full cursor-pointer text-muted-foreground">
            <SelectValue placeholder="Todos os leilões" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os leilões</SelectItem>
            <SelectItem value="active">Leilões ativos</SelectItem>
            <SelectItem value="ending-soon">Terminando em breve</SelectItem>
            <SelectItem value="new">Novos leilões</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Faixa de Preço</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="min-price" className="mb-2">
              Preço mínimo
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="R$ 0"
              value={filters.minPrice}
              onChange={handleMinPriceChange}
            />
          </div>
          <div>
            <Label htmlFor="max-price" className="mb-2">
              Preço máximo
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="R$ 10000"
              value={filters.maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>

      <Separator />

      <Button
        onClick={resetFilters}
        variant="outline"
        className="w-full cursor-pointer border-primary text-primary hover:text-white hover:bg-primary transition-colors"
      >
        Limpar Filtros
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros para desktop */}
        <div className="hidden md:block w-64 shrink-0">
          <FilterSidebar />
        </div>

        {/* Filtros para mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden mb-4">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-background border-r p-6">
            <h2 className="text-xl font-serif font-medium mb-6">Filtros</h2>
            <FilterSidebar />
          </SheetContent>
        </Sheet>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold mb-1">Leilões</h1>
              <p className="text-muted-foreground">
                {filteredAuctions.length} leilões encontrados
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Input
                placeholder="Buscar leilões..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full sm:w-auto"
              />
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[195px] cursor-pointer">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ending-soon">
                    Terminando em breve
                  </SelectItem>
                  <SelectItem value="price-asc">Menor Lance</SelectItem>
                  <SelectItem value="price-desc">Maior Lance</SelectItem>
                  <SelectItem value="most-bids">Mais Lances</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredAuctions.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">
                Nenhum leilão encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar seus filtros ou buscar por outro termo.
              </p>
              <Button onClick={resetFilters}>Limpar Filtros</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
              {sortedAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
