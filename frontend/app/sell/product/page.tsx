"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ImagePlus, X } from "lucide-react";

import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import type { Product } from "@types";

const ERAS = [
  { value: "antiquity", label: "Antiguidade" },
  { value: "17th", label: "Século XVII" },
  { value: "18th", label: "Século XVIII" },
  { value: "19th", label: "Século XIX" },
  { value: "20th", label: "Século XX" },
  { value: "other", label: "Outra" },
];

const CONDITIONS = [
  { value: "EXCELLENT", label: "Excelente" },
  { value: "GOOD", label: "Bom" },
  { value: "FAIR", label: "Regular" },
  { value: "RESTORED", label: "Restaurado" },
  { value: "DAMAGED", label: "Com danos" },
];

const AUTHENTICITY = [
  { value: "VERIFIED", label: "Verificada com certificado" },
  { value: "GUARANTEED", label: "Garantida pelo vendedor" },
  { value: "UNKNOWN", label: "Não verificada" },
];

export default function SellProductPage() {
  const router = useRouter();
  const { createProduct, loading: storeLoading } = useProductStore();
  const {
    categories,
    fetchAllCategories,
    loading: categoriesLoading,
  } = useCategoryStore();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [era, setEra] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<string | undefined>(undefined);
  const [origin, setOrigin] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [material, setMaterial] = useState("");
  const [authenticity, setAuthenticity] = useState<string | undefined>(
    undefined
  );
  const [history, setHistory] = useState("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Convert file to base64 string
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const filesArray = Array.from(files).slice(0, 8 - images.length); // limit 8 images
    try {
      const base64Promises = filesArray.map((f) => fileToBase64(f));
      const base64s = await Promise.all(base64Promises);
      setImages((prev) => [...prev, ...base64s]);
    } catch (err) {
      console.error("Image read error", err);
      toast.error("Erro ao processar imagens");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!title.trim()) return "Preencha o título do anúncio";
    if (!category) return "Selecione uma categoria";
    if (!era) return "Selecione a época";
    if (!description.trim()) return "Preencha a descrição detalhada";
    if (!condition) return "Selecione o estado de conservação";
    if (!price || Number.isNaN(Number(price)) || Number(price) < 0)
      return "Informe um preço válido (>= 0)";
    if (!quantity || quantity < 1) return "Quantidade mínima: 1";
    if (images.length === 0) return "Adicione ao menos 1 imagem";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    type Condition = "EXCELLENT" | "GOOD" | "FAIR" | "RESTORED" | "DAMAGED";
    type Authenticity = "VERIFIED" | "GUARANTEED" | "UNKNOWN" | "DISPUTED";

    const payload: Product = {
      title,
      description,
      price: parseFloat(price),
      quantity,
      images, // base64 strings
      condition: condition as Condition,
      categoryId: category,
      dimensions,
      era,
      origin,
      material,
      authenticity: authenticity as Authenticity,
      provenance: history,
    };

    await createProduct(payload);
    // small delay to let store update and UX be nice
    // setTimeout(() => {
    //   router.push("/perfil/vendas?success=true");
    // }, 600);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/sell">Vender</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Anunciar Produto</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-serif font-bold mb-2">Anunciar Produto</h1>
        <p className="text-muted-foreground mb-8">
          Preencha os detalhes do seu item para criar um anúncio atrativo.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Informações Básicas
                  </CardTitle>
                  <CardDescription>Detalhes essenciais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="mb-1">
                      Título do anúncio *
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Relógio de Bolso Vintage Século XIX"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Seja específico: marca, época ou estilo.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="mb-1">
                        Categoria *
                      </Label>
                      <Select
                        onValueChange={(val) => setCategory(val)}
                        value={category}
                      >
                        <SelectTrigger
                          id="category"
                          className="w-full cursor-pointer"
                        >
                          <SelectValue
                            placeholder={
                              categoriesLoading
                                ? "Carregando categorias..."
                                : "Selecione uma categoria"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 ? (
                            categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))
                          ) : categoriesLoading ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              Carregando...
                            </div>
                          ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              Nenhuma categoria
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="era" className="mb-1">
                        Época *
                      </Label>
                      <Select onValueChange={(val) => setEra(val)} value={era}>
                        <SelectTrigger
                          id="era"
                          className="w-full cursor-pointer"
                        >
                          <SelectValue placeholder="Selecione a época" />
                        </SelectTrigger>
                        <SelectContent>
                          {ERAS.map((e) => (
                            <SelectItem key={e.value} value={e.value}>
                              {e.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="mb-1">
                      Descrição detalhada *
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva o item em detalhes, incluindo histórico e estado."
                      rows={6}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Especificações</CardTitle>
                  <CardDescription>Detalhes técnicos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="condition" className="mb-1">
                        Estado de conservação *
                      </Label>
                      <Select
                        onValueChange={(val) => setCondition(val)}
                        value={condition}
                      >
                        <SelectTrigger
                          id="condition"
                          className="w-full cursor-pointer"
                        >
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONDITIONS.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="origin" className="mb-1">
                        Origem
                      </Label>
                      <Input
                        id="origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="Ex: França"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dimensions" className="mb-1">
                        Dimensões
                      </Label>
                      <Input
                        id="dimensions"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        placeholder="Ex: 50cm x 30cm x 20cm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="material" className="mb-1">
                        Material principal
                      </Label>
                      <Input
                        id="material"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        placeholder="Ex: Madeira, Ouro"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="authenticity" className="mb-1">
                      Autenticidade
                    </Label>
                    <Select
                      onValueChange={(val) => setAuthenticity(val)}
                      value={authenticity}
                    >
                      <SelectTrigger
                        id="authenticity"
                        className="w-full cursor-pointer"
                      >
                        <SelectValue placeholder="Selecione a autenticidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {AUTHENTICITY.map((a) => (
                          <SelectItem key={a.value} value={a.value}>
                            {a.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="history" className="mb-1">
                      História do item
                    </Label>
                    <Textarea
                      id="history"
                      value={history}
                      onChange={(e) => setHistory(e.target.value)}
                      placeholder="Procedência, proprietários anteriores, restaurações, etc."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Preço e Disponibilidade
                  </CardTitle>
                  <CardDescription>Defina valor e quantidade</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="mb-1">
                        Preço (R$) *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0,00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="mb-1">
                        Quantidade disponível *
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Imagens</CardTitle>
                  <CardDescription>
                    Adicione fotos de alta qualidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label
                    htmlFor="images"
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors block"
                  >
                    <div className="flex flex-col items-center">
                      <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Clique ou selecione imagens (até 8)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recomendado: pelo menos 4 fotos de diferentes ângulos
                      </p>
                    </div>
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </label>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group rounded-md overflow-hidden border"
                        >
                          <Image
                            src={image}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-28 object-cover"
                            width={400}
                            height={300}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Resumo</CardTitle>
                  <CardDescription>
                    Revise as informações antes de publicar
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="font-medium text-foreground">
                        Título:
                      </span>
                      <br />
                      {title || "—"}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Categoria:
                      </span>
                      <br />
                      {categories.find((c) => c.id === category)?.name || "—"}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Época:
                      </span>
                      <br />
                      {ERAS.find((e) => e.value === era)?.label || "—"}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Estado:
                      </span>
                      <br />
                      {CONDITIONS.find((c) => c.value === condition)?.label ||
                        "—"}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Preço:
                      </span>
                      <br />
                      {price ? `R$ ${parseFloat(price).toFixed(2)}` : "—"}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Quantidade:
                      </span>
                      <br />
                      {quantity}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-foreground">
                        Autenticidade:
                      </span>
                      <br />
                      {AUTHENTICITY.find((a) => a.value === authenticity)
                        ?.label || "—"}
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium text-foreground mb-2">
                        Prévia das imagens:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {images.slice(0, 3).map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            alt={`Imagem ${index + 1}`}
                            className="rounded object-cover w-full h-20"
                            width={120}
                            height={80}
                          />
                        ))}
                      </div>
                      {images.length > 3 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          + {images.length - 3} imagem(ns) adicional(is)
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={storeLoading}
                  >
                    {storeLoading ? "Publicando..." : "Publicar Anúncio"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href="/sell">Cancelar</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
