"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/stores/useProductStore";

export default function ProductsPage() {
  const {
    products,
    fetchAllProducts,
    loading: storeLoading,
  } = useProductStore();

  // Local UI state for filters
  const [category, setCategory] = useState<string>("");
  const [eraFilters, setEraFilters] = useState<string[]>([]);
  const [conditionFilters, setConditionFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [search, setSearch] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // debounce search
  const searchRef = useRef<number | null>(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // derive facets from products
  const facets = useMemo(() => {
    const cats = new Set<string>();
    const eras = new Set<string>();
    const conds = new Set<string>();
    let min = Number.POSITIVE_INFINITY;
    let max = 0;

    for (const p of products) {
      if (p.category && (p as any).category?.name) {
        cats.add((p as any).category.name);
      } else if (typeof p.categoryId === "string") {
        // fallback: show categoryId (not ideal)
        cats.add(p.categoryId ?? "Outros");
      }
      if (p.era) eras.add(p.era);
      if (p.condition) conds.add(p.condition);
      if (typeof p.price === "number") {
        min = Math.min(min, p.price);
        max = Math.max(max, p.price);
      }
    }

    if (!isFinite(min)) min = 0;
    if (max === 0) max = 10000;

    return {
      categories: Array.from(cats).sort(),
      eras: Array.from(eras).sort(),
      conditions: Array.from(conds).sort(),
      priceMin: Math.floor(min),
      priceMax: Math.ceil(max),
    };
  }, [products]);

  // keep slider bounds in sync with data
  useEffect(() => {
    setPriceRange([facets.priceMin, facets.priceMax]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facets.priceMin, facets.priceMax]);

  // filtering logic
  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products
      .filter((p) => {
        // category filter
        if (category && category !== "all") {
          const catName = (p as any).category?.name ?? p.categoryId ?? "";
          if (!catName || catName !== category) return false;
        }

        // price filter
        if (typeof p.price === "number") {
          if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
        }

        // era filter
        if (eraFilters.length > 0) {
          if (!p.era || !eraFilters.includes(p.era)) return false;
        }

        // condition filter
        if (conditionFilters.length > 0) {
          if (!p.condition || !conditionFilters.includes(p.condition))
            return false;
        }

        // search
        if (q) {
          const title = (p.title ?? (p as any).name ?? "").toLowerCase();
          const desc = (p.description ?? "").toLowerCase();
          if (!title.includes(q) && !desc.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return (a.price ?? 0) - (b.price ?? 0);
          case "price-desc":
            return (b.price ?? 0) - (a.price ?? 0);
          case "name-asc":
            return (a.title ?? "").localeCompare(b.title ?? "");
          case "name-desc":
            return (b.title ?? "").localeCompare(a.title ?? "");
          default:
            return 0;
        }
      });
  }, [
    products,
    category,
    priceRange,
    eraFilters,
    conditionFilters,
    search,
    sortBy,
  ]);

  // handlers
  const toggleEra = (e: string) =>
    setEraFilters((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  const toggleCondition = (c: string) =>
    setConditionFilters((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  const resetFilters = () => {
    setCategory("");
    setEraFilters([]);
    setConditionFilters([]);
    setPriceRange([facets.priceMin, facets.priceMax]);
    setSortBy("relevance");
    setSearch("");
  };

  // debounce search input to not re-render on every keystroke
  const onSearchChange = (v: string) => {
    if (searchRef.current) window.clearTimeout(searchRef.current);
    searchRef.current = window.setTimeout(() => {
      setSearch(v);
    }, 300);
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
              <Label className="mb-2">Faixa de preço</Label>
              <div className="space-y-3">
                <Slider
                  min={facets.priceMin}
                  max={facets.priceMax}
                  step={10}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v)}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-sm">
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(priceRange[0])}
                  </span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(priceRange[1])}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="mb-2">Época</Label>
              <div className="space-y-2 mt-2">
                {facets.eras.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma época
                  </div>
                ) : (
                  facets.eras.map((e) => (
                    <div key={e} className="flex items-center gap-2">
                      <Checkbox
                        id={`era-${e}`}
                        checked={eraFilters.includes(e)}
                        onCheckedChange={() => toggleEra(e)}
                        className="cursor-pointer"
                      />
                      <Label htmlFor={`era-${e}`} className="cursor-pointer">
                        {e}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="mb-2">Condição</Label>
              <div className="space-y-2 mt-2">
                {facets.conditions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma condição
                  </div>
                ) : (
                  facets.conditions.map((c) => (
                    <div key={c} className="flex items-center gap-2">
                      <Checkbox
                        id={`cond-${c}`}
                        checked={conditionFilters.includes(c)}
                        onCheckedChange={() => toggleCondition(c)}
                        className="cursor-pointer"
                      />
                      <Label htmlFor={`cond-${c}`} className="cursor-pointer">
                        {c}
                      </Label>
                    </div>
                  ))
                )}
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
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar produtos..."
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <SheetTrigger asChild>
                <Button variant="outline" className="ml-3">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
            </div>
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
                <Label className="mb-2">Faixa de preço</Label>
                <Slider
                  min={facets.priceMin}
                  max={facets.priceMax}
                  step={10}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v)}
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(priceRange[0])}
                  </span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(priceRange[1])}
                  </span>
                </div>
              </div>

              <div>
                <Label className="mb-2">Época</Label>
                <div className="space-y-2 mt-2">
                  {facets.eras.map((e) => (
                    <div key={e} className="flex items-center gap-2">
                      <Checkbox
                        id={`m-era-${e}`}
                        checked={eraFilters.includes(e)}
                        onCheckedChange={() => toggleEra(e)}
                      />
                      <Label htmlFor={`m-era-${e}`}>{e}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2">Condição</Label>
                <div className="space-y-2 mt-2">
                  {facets.conditions.map((c) => (
                    <div key={c} className="flex items-center gap-2">
                      <Checkbox
                        id={`m-cond-${c}`}
                        checked={conditionFilters.includes(c)}
                        onCheckedChange={() => toggleCondition(c)}
                      />
                      <Label htmlFor={`m-cond-${c}`}>{c}</Label>
                    </div>
                  ))}
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
              <h1 className="text-2xl font-serif font-bold mb-1">Produtos</h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} itens encontrados
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden md:block w-[360px]">
                <Input
                  placeholder="Buscar produtos..."
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance" className="cursor-pointer">
                      Relevância
                    </SelectItem>
                    <SelectItem value="price-asc" className="cursor-pointer">
                      Menor Preço
                    </SelectItem>
                    <SelectItem value="price-desc" className="cursor-pointer">
                      Maior Preço
                    </SelectItem>
                    <SelectItem value="name-asc" className="cursor-pointer">
                      A-Z
                    </SelectItem>
                    <SelectItem value="name-desc" className="cursor-pointer">
                      Z-A
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
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar seus filtros ou buscar por outro termo.
              </p>
              <Button onClick={resetFilters}>Limpar Filtros</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
