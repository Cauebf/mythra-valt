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
import { ImagePlus, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useCategoryStore } from "@/stores/useCategoryStore";
import { useAuctionStore } from "@/stores/useAuctionStore";
import { Auction, Authenticity, Condition } from "@types";

const ERAS = [
  { value: "antiguidade", label: "Antiguidade" },
  { value: "17th", label: "Século XVII" },
  { value: "18th", label: "Século XVIII" },
  { value: "19th", label: "Século XIX" },
  { value: "20th", label: "Século XX" },
  { value: "outra", label: "Outra" },
];

const CONDITIONS = [
  { value: "EXCELENTE", label: "Excelente" },
  { value: "BOA", label: "Bom" },
  { value: "REGULAR", label: "Regular" },
  { value: "RESTAURADA", label: "Restaurado" },
  { value: "DANIFICADA", label: "Com danos" },
];

const AUTHENTICITY = [
  { value: "VERIFICADA", label: "Verificada com certificado" },
  { value: "GARANTIDA", label: "Garantida pelo vendedor" },
  { value: "DESCONHECIDA", label: "Não verificada" },
];

export default function CreateAuctionPage() {
  const router = useRouter();
  const { createAuction, loading: auctionLoading } = useAuctionStore();
  const {
    categories,
    fetchAllCategories,
    loading: categoriesLoading,
  } = useCategoryStore();

  // form state
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
  const [provenance, setProvenance] = useState("");

  // auction settings
  const [startingBid, setStartingBid] = useState<string>("0.00");
  const [durationDays, setDurationDays] = useState<string>("7"); // default 7 days
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    // default start = today (format YYYY-MM-DD)
    return today.toISOString().slice(0, 10);
  });

  // images (base64)
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  // convert file to base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const allowed = Array.from(files).slice(0, 8 - images.length);
    try {
      const base64s = await Promise.all(allowed.map((f) => fileToBase64(f)));
      setImages((prev) => [...prev, ...base64s]);
    } catch (err) {
      console.error("Image read error", err);
      toast.error("Erro ao processar imagens");
    }
  };

  const handleRemoveImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    if (!title.trim()) return "Preencha o título do leilão";
    if (!category) return "Selecione uma categoria";
    if (!era) return "Selecione a época";
    if (!description.trim()) return "Preencha a descrição detalhada";
    if (!condition) return "Selecione o estado de conservação";
    const sb = parseFloat(startingBid);
    if (Number.isNaN(sb) || sb < 0)
      return "Informe um lance inicial válido (>= 0)";
    if (!startDate) return "Informe a data de início";
    if (
      !durationDays ||
      Number.isNaN(parseInt(durationDays)) ||
      parseInt(durationDays) < 1
    )
      return "Selecione uma duração válida";
    if (images.length === 0) return "Adicione ao menos 1 imagem";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      toast.error(errMsg);
      return;
    }

    const start = new Date(startDate + "T00:00:00Z");
    const days = parseInt(durationDays, 10);
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    const payload: Auction = {
      title,
      description,
      images,
      era,
      origin,
      material,
      authenticity: authenticity as Authenticity,
      provenance,
      dimensions,
      condition: condition as Condition,
      startingBid: parseFloat(startingBid),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      categoryId: category!,
    };

    const created = await createAuction(payload);

    if (created) {
      // redirect after small delay so user sees toast
      // setTimeout(() => router.push("/perfil/leiloes?success=true"), 600);
    }
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
            <BreadcrumbLink>Criar Leilão</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-serif font-bold mb-2">Criar Leilão</h1>
        <p className="text-muted-foreground mb-8">
          Configure seu leilão para atrair lances competitivos para seu item.
        </p>

        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-600">Dica para leilões</AlertTitle>
          <AlertDescription className="text-amber-700">
            Leilões com lance inicial mais baixo tendem a atrair mais
            participantes.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Informações do Item
                  </CardTitle>
                  <CardDescription>Detalhes sobre o item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="mb-1">
                      Título do leilão *
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Pintura a Óleo Século XIX - Paisagem Europeia"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Um título atrativo aumenta a visibilidade.
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
                                ? "Carregando..."
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
                      placeholder="Descreva o item: características, história, estado."
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
                    <Label htmlFor="provenance" className="mb-1">
                      Procedência
                    </Label>
                    <Textarea
                      id="provenance"
                      value={provenance}
                      onChange={(e) => setProvenance(e.target.value)}
                      placeholder="Histórico de propriedade, certificados, etc."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Configurações do Leilão
                  </CardTitle>
                  <CardDescription>Defina os parâmetros</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="starting-bid" className="mb-1">
                        Lance inicial (R$) *
                      </Label>
                      <Input
                        id="starting-bid"
                        type="number"
                        min="0"
                        step="0.01"
                        value={startingBid}
                        onChange={(e) => setStartingBid(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Valor mínimo para iniciar os lances
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="duration" className="mb-1">
                        Duração do leilão *
                      </Label>
                      <Select
                        onValueChange={(val) => setDurationDays(val)}
                        value={durationDays}
                      >
                        <SelectTrigger
                          id="duration"
                          className="w-full cursor-pointer"
                        >
                          <SelectValue placeholder="Selecione a duração" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 dias</SelectItem>
                          <SelectItem value="5">5 dias</SelectItem>
                          <SelectItem value="7">7 dias</SelectItem>
                          <SelectItem value="10">10 dias</SelectItem>
                          <SelectItem value="14">14 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 items-end">
                    <div>
                      <Label htmlFor="start-date" className="mb-1">
                        Data de início *
                      </Label>
                      <div className="relative">
                        <Input
                          id="start-date"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-1">Observações</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Comece o leilão quando quiser — a data escolhida é
                        convertida para UTC ao enviar.
                      </p>
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
                        Recomendado: pelo menos 4 fotos
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
                            className="w-full h-24 object-cover rounded-md"
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
                        Lance inicial:
                      </span>
                      <br />
                      {`R$ ${parseFloat(startingBid || "0").toFixed(2)}`}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Duração:
                      </span>
                      <br />
                      {durationDays} dias
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
                    disabled={auctionLoading}
                  >
                    {auctionLoading ? "Publicando..." : "Publicar Leilão"}
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
