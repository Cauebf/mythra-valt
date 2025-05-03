"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Heart, Share, ShoppingCart, Truck, Shield, Star } from "lucide-react"
import ProductCard from "@/components/ProductCard"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)

  // Dados simulados do produto
  const product = {
    id: params.id,
    name: "Relógio de Bolso Vintage Século XIX",
    price: 1250,
    description:
      "Relógio de bolso em ouro 18k, fabricado na Suíça em 1880. Peça rara em excelente estado de conservação, com mecanismo original funcionando perfeitamente. Inclui corrente original e estojo de couro da época.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "Relógios",
    era: "Século XIX",
    condition: "Excelente",
    dimensions: "Diâmetro: 5cm, Espessura: 1.5cm",
    origin: "Suíça",
    seller: {
      id: "seller123",
      name: "Antiquário Clássico",
      rating: 4.8,
      sales: 156,
    },
    inStock: 1,
    specifications: [
      { name: "Material", value: "Ouro 18k" },
      { name: "Ano", value: "c. 1880" },
      { name: "Estado", value: "Excelente, funcionando" },
      { name: "Origem", value: "Suíça" },
      { name: "Autenticidade", value: "Verificada" },
    ],
    history:
      "Este relógio pertenceu a uma família aristocrática europeia por gerações. Foi adquirido em um leilão em Paris em 2010 e passou por uma cuidadosa restauração por um relojoeiro especializado em peças de época.",
  }

  // Produtos relacionados simulados
  const relatedProducts = [
    {
      id: "2",
      name: "Relógio de Mesa Art Déco",
      price: 2800,
      image: "/placeholder.svg?height=300&width=300",
      category: "Relógios",
    },
    {
      id: "3",
      name: "Corrente de Relógio Vitoriana",
      price: 650,
      image: "/placeholder.svg?height=300&width=300",
      category: "Acessórios",
    },
    {
      id: "4",
      name: "Estojo para Relógio Antigo",
      price: 450,
      image: "/placeholder.svg?height=300&width=300",
      category: "Acessórios",
    },
  ]

  const incrementQuantity = () => {
    if (quantity < product.inStock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/produtos">Produtos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/produtos?categoria=${product.category}`}>{product.category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Imagens do produto */}
        <div className="space-y-4">
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden border">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 border rounded ${
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - imagem ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Informações do produto */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{product.era}</Badge>
            <Badge variant="outline">{product.condition}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-1 mb-4">
            <Link href={`/vendedor/${product.seller.id}`} className="text-sm text-muted-foreground hover:text-primary">
              Vendido por {product.seller.name}
            </Link>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="text-sm ml-1">{product.seller.rating}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold mb-1">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.price)}
            </p>
            <p className="text-sm text-muted-foreground">Em até 12x sem juros</p>
          </div>

          <div className="mb-6">
            <p className="text-sm mb-4">{product.description}</p>
            <div className="grid grid-cols-2 gap-4">
              {product.specifications.map((spec, index) => (
                <div key={index}>
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
                <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.inStock}
                >
                  +
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{product.inStock} disponível</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline" size="icon" className="shrink-0">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Adicionar aos favoritos</span>
              </Button>
              <Button variant="outline" size="icon" className="shrink-0">
                <Share className="h-5 w-5" />
                <span className="sr-only">Compartilhar</span>
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

      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="history">História</TabsTrigger>
          <TabsTrigger value="shipping">Envio</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <h2 className="text-xl font-medium">Sobre este item</h2>
          <p>{product.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-medium mb-2">Especificações</h3>
              <ul className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="flex">
                    <span className="font-medium w-32">{spec.name}:</span>
                    <span>{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Dimensões</h3>
              <p>{product.dimensions}</p>
              <h3 className="font-medium mt-4 mb-2">Origem</h3>
              <p>{product.origin}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <h2 className="text-xl font-medium mb-4">História do Item</h2>
          <p>{product.history}</p>
        </TabsContent>
        <TabsContent value="shipping">
          <h2 className="text-xl font-medium mb-4">Informações de Envio</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Prazo de Entrega</h3>
              <p>7-10 dias úteis para todo o Brasil. Envio com seguro e rastreamento.</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Embalagem</h3>
              <p>
                Todos os itens são cuidadosamente embalados para garantir a segurança durante o transporte. Itens
                frágeis recebem embalagem especial.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Política de Devolução</h3>
              <p>
                Aceitamos devoluções em até 14 dias após o recebimento, desde que o item esteja nas mesmas condições em
                que foi enviado.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Produtos Relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
