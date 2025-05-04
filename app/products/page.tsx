"use client";

import { useState } from "react";
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
import { products } from "@/lib/placeholder-data";

export default function ProductsPage() {

  const [filters, setFilters] = useState<{
    category: string;
    priceRange: number[];
    era: string[];
    condition: string[];
    search: string;
  }>({
    category: "",
    priceRange: [0, 10000],
    era: [],
    condition: [],
    search: "",
  });
  const [sortBy, setSortBy] = useState("relevance");

  // Filtrar produtos com base nos filtros selecionados
  const filteredProducts = products.filter((product) => {
    // Filtro por categoria
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Filtro por preço
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }

    // Filtro por era
    if (filters.era.length > 0 && !filters.era.includes(product.era)) {
      return false;
    }

    // Filtro por condição
    if (
      filters.condition.length > 0 &&
      !filters.condition.includes(product.condition)
    ) {
      return false;
    }

    // Filtro por busca
    if (
      filters.search &&
      !product.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Ordenar produtos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
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
    "Música",
    "Escritório",
    "Decoração",
  ];

  const eras = [
    "Antiguidade",
    "Século XVII",
    "Século XVIII",
    "Século XIX",
    "Século XX",
  ];

  const conditions = ["Excelente", "Bom", "Regular", "Restaurado"];

  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value });
  };

  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, priceRange: value });
  };

  const handleEraChange = (era: string) => {
    setFilters({
      ...filters,
      era: filters.era.includes(era)
        ? filters.era.filter((e) => e !== era)
        : [...filters.era, era],
    });
  };

  const handleConditionChange = (condition: string) => {
    setFilters({
      ...filters,
      condition: filters.condition.includes(condition)
        ? filters.condition.filter((c) => c !== condition)
        : [...filters.condition, condition],
    });
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
      priceRange: [0, 10000],
      era: [],
      condition: [],
      search: "",
    });
    setSortBy("relevance");
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
            <SelectItem value="all">Todas as categorias</SelectItem>
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
        <h3 className="font-medium mb-4">Faixa de Preço</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={filters.priceRange}
            min={0}
            max={10000}
            step={100}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between">
            <span>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(filters.priceRange[0])}
            </span>
            <span>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(filters.priceRange[1])}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Época</h3>
        <div className="space-y-2">
          {eras.map((era) => (
            <div key={era} className="flex items-center space-x-2">
              <Checkbox
                id={`era-${era}`}
                checked={filters.era.includes(era)}
                onCheckedChange={() => handleEraChange(era)}
              />
              <Label htmlFor={`era-${era}`}>{era}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4">Condição</h3>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={filters.condition.includes(condition)}
                onCheckedChange={() => handleConditionChange(condition)}
              />
              <Label htmlFor={`condition-${condition}`}>{condition}</Label>
            </div>
          ))}
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
          <SheetContent side="left">
            <h2 className="text-lg font-medium mb-6">Filtros</h2>
            <FilterSidebar />
          </SheetContent>
        </Sheet>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold mb-1">Produtos</h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} itens encontrados
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Input
                placeholder="Buscar produtos..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full sm:w-auto"
              />
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[195px] cursor-pointer">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                  <SelectItem value="name-asc">A-Z</SelectItem>
                  <SelectItem value="name-desc">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
