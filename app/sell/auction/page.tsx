"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ImagePlus, X, Info, AlertCircle, Calendar } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateAuctionPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simulação de upload de imagem
  const handleImageUpload = () => {
    // Em um caso real, aqui seria implementado o upload real da imagem
    const newImage = `/placeholder.svg?height=300&width=300&text=Imagem ${images.length + 1}`
    setImages([...images, newImage])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulação de envio do formulário
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirecionar para a página de sucesso ou perfil
      router.push("/perfil/leiloes?success=true")
    }, 1500)
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
          Configure seu leilão para atrair lances competitivos para seu item de coleção ou antiguidade.
        </p>

        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-600">Dica para leilões</AlertTitle>
          <AlertDescription className="text-amber-700">
            Leilões com lance inicial mais baixo tendem a atrair mais participantes e frequentemente alcançam valores
            finais mais altos.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Informações do Item</CardTitle>
                  <CardDescription>Detalhes sobre o item a ser leiloado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="mb-1">Título do leilão *</Label>
                    <Input id="title" placeholder="Ex: Pintura a Óleo Século XIX - Paisagem Europeia" required />
                    <p className="text-xs text-muted-foreground mt-1">
                      Um título atrativo aumenta o interesse e a visibilidade do seu leilão.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="mb-1">Categoria *</Label>
                      <Select required>
                        <SelectTrigger id="category" className="w-full cursor-pointer">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="furniture">Móveis</SelectItem>
                          <SelectItem value="art">Arte</SelectItem>
                          <SelectItem value="jewelry">Joias</SelectItem>
                          <SelectItem value="books">Livros</SelectItem>
                          <SelectItem value="watches">Relógios</SelectItem>
                          <SelectItem value="porcelain">Porcelana</SelectItem>
                          <SelectItem value="numismatics">Numismática</SelectItem>
                          <SelectItem value="other">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="era" className="mb-1">Época *</Label>
                      <Select required>
                        <SelectTrigger id="era" className="w-full cursor-pointer">
                          <SelectValue placeholder="Selecione a época" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="antiquity">Antiguidade</SelectItem>
                          <SelectItem value="17th">Século XVII</SelectItem>
                          <SelectItem value="18th">Século XVIII</SelectItem>
                          <SelectItem value="19th">Século XIX</SelectItem>
                          <SelectItem value="20th">Século XX</SelectItem>
                          <SelectItem value="other">Outra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="mb-1">Descrição detalhada *</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o item em detalhes, incluindo características, história, estado de conservação, etc."
                      rows={6}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Especificações</CardTitle>
                  <CardDescription>Detalhes técnicos e características do item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="condition" className="mb-1">Estado de conservação *</Label>
                      <Select required>
                        <SelectTrigger id="condition" className="w-full cursor-pointer">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excelente</SelectItem>
                          <SelectItem value="good">Bom</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="restored">Restaurado</SelectItem>
                          <SelectItem value="damaged">Com danos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="origin" className="mb-1">Origem</Label>
                      <Input id="origin" placeholder="Ex: França, Alemanha, etc." />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dimensions" className="mb-1">Dimensões</Label>
                      <Input id="dimensions" placeholder="Ex: 50cm x 30cm x 20cm" />
                    </div>
                    <div>
                      <Label htmlFor="material" className="mb-1">Material principal</Label>
                      <Input id="material" placeholder="Ex: Madeira, Ouro, Prata, etc." />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="authenticity" className="mb-1">Autenticidade</Label>
                    <Select>
                      <SelectTrigger id="authenticity" className="w-full cursor-pointer">
                        <SelectValue placeholder="Selecione a autenticidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verified">Verificada com certificado</SelectItem>
                        <SelectItem value="guaranteed">Garantida pelo vendedor</SelectItem>
                        <SelectItem value="unknown">Não verificada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="provenance" className="mb-1">Procedência</Label>
                    <Textarea
                      id="provenance"
                      placeholder="Descreva a origem e histórico de propriedade do item"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Configurações do Leilão</CardTitle>
                  <CardDescription>Defina os parâmetros do seu leilão</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="starting-bid" className="mb-1">Lance inicial (R$) *</Label>
                      <Input id="starting-bid" type="number" min="0" step="0.01" placeholder="0,00" required />
                      <p className="text-xs text-muted-foreground mt-1">Valor mínimo para iniciar os lances</p>
                    </div>
                    <div>
                      <Label htmlFor="reserve-price" className="mb-1">Preço de reserva (R$)</Label>
                      <Input id="reserve-price" type="number" min="0" step="0.01" placeholder="0,00" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Valor mínimo para concluir a venda (opcional)
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration" className="mb-1">Duração do leilão *</Label>
                      <Select required>
                        <SelectTrigger id="duration" className="w-full cursor-pointer">
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
                    <div>
                      <Label htmlFor="start-date" className="mb-1">Data de início *</Label>
                      <div className="relative">
                        <Input id="start-date" type="date" required />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="shipping">Opções de envio após o leilão *</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Defina como o item será enviado ao vencedor do leilão.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select required>
                      <SelectTrigger id="shipping" className="w-full cursor-pointer">
                        <SelectValue placeholder="Selecione a opção de envio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Frete grátis</SelectItem>
                        <SelectItem value="fixed">Frete fixo</SelectItem>
                        <SelectItem value="calculated">Frete calculado pelo comprador</SelectItem>
                        <SelectItem value="pickup">Apenas retirada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Imagens</CardTitle>
                  <CardDescription>Adicione fotos de alta qualidade do seu item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={handleImageUpload}
                  >
                    <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Clique para adicionar imagens</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recomendado: pelo menos 4 fotos de diferentes ângulos
                    </p>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
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
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxa de serviço (7.5%)</span>
                      <span>Calculado após o leilão</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Você receberá</span>
                      <span>92.5% do lance vencedor</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full cursor-pointer disabled:cursor-not-allowed" disabled={isSubmitting}>
                    {isSubmitting ? "Publicando..." : "Publicar Leilão"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <Link href="/vender">Cancelar</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
