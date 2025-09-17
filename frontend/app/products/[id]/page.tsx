"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Heart, Share, ShoppingCart, Truck, Shield, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProductCard from "@/components/ProductCard";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");

  // Dados simulados de avaliações
  const [reviews, setReviews] = useState([
    {
      id: "1",
      author: "Carlos Mendes",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      comment:
        "Peça excepcional, exatamente como descrita. A qualidade e o estado de conservação superaram minhas expectativas. O vendedor foi muito atencioso e o envio foi rápido.",
      date: "15/12/2023",
    },
    {
      id: "2",
      author: "Ana Luiza",
      avatar: "/placeholder-user.jpg",
      rating: 4,
      comment:
        "Relógio belíssimo, com mecanismo funcionando perfeitamente. Apenas a corrente apresenta pequenos sinais de desgaste, mas nada que comprometa a beleza da peça.",
      date: "10/12/2023",
    },
    {
      id: "3",
      author: "Roberto Almeida",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      comment:
        "Como colecionador, posso afirmar que esta é uma das melhores aquisições que já fiz. Autenticidade comprovada e estado de conservação impecável.",
      date: "05/12/2023",
    },
  ]);

  // Dados simulados do produto
  const product = {
    id: id,
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
  };

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
  ];

  const incrementQuantity = () => {
    if (quantity < product.inStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const [selectedImage, setSelectedImage] = useState(0);

  const handleSubmitReview = () => {
    if (userRating === 0 || !userComment.trim()) {
      alert("Por favor, selecione uma avaliação e escreva um comentário.");
      return;
    }

    const newReview = {
      id: `review-${Date.now()}`,
      author: "Você",
      avatar: "/placeholder-user.jpg",
      rating: userRating,
      comment: userComment,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setUserComment("");
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
            <BreadcrumbLink href="/products">products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/products?category=${product.category}`}>
              {product.category}
            </BreadcrumbLink>
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
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4.7
                      ? "fill-amber-500 text-amber-500"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              (23 avaliações)
            </span>
          </div>
          <div className="flex items-center gap-1 mb-4">
            <Link
              href={`/vendedor/${product.seller.id}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
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
            <p className="text-sm text-muted-foreground">
              Em até 12x sem juros
            </p>
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
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
              <p className="text-sm text-muted-foreground">
                {product.inStock} disponível
              </p>
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
              <p>
                7-10 dias úteis para todo o Brasil. Envio com seguro e
                rastreamento.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Embalagem</h3>
              <p>
                Todos os itens são cuidadosamente embalados para garantir a
                segurança durante o transporte. Itens frágeis recebem embalagem
                especial.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Política de Devolução</h3>
              <p>
                Aceitamos devoluções em até 14 dias após o recebimento, desde
                que o item esteja nas mesmas condições em que foi enviado.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">
          Produtos Relacionados
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">
          Avaliações e Comentários
        </h2>

        {/* Resumo das avaliações */}
        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-8">
          <div className="bg-muted p-6 rounded-lg text-center">
            <div className="text-4xl font-bold mb-2">4.7</div>
            <div className="flex justify-center mb-2">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              <Star className="h-5 w-5 fill-amber-500 text-amber-500 fill-opacity-50" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Baseado em 23 avaliações
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-sm w-8">5 ★</div>
                <div className="h-2 flex-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[75%]"></div>
                </div>
                <div className="text-sm w-8">75%</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm w-8">4 ★</div>
                <div className="h-2 flex-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[20%]"></div>
                </div>
                <div className="text-sm w-8">20%</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm w-8">3 ★</div>
                <div className="h-2 flex-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[5%]"></div>
                </div>
                <div className="text-sm w-8">5%</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm w-8">2 ★</div>
                <div className="h-2 flex-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[0%]"></div>
                </div>
                <div className="text-sm w-8">0%</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm w-8">1 ★</div>
                <div className="h-2 flex-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[0%]"></div>
                </div>
                <div className="text-sm w-8">0%</div>
              </div>
            </div>
          </div>

          {/* Formulário de avaliação */}
          <div>
            <h3 className="text-lg font-medium mb-4">Adicionar avaliação</h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium mb-2"
                >
                  Sua avaliação
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="text-amber-500"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= userRating
                            ? "fill-amber-500 text-amber-500"
                            : "fill-muted text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium mb-2"
                >
                  Seu comentário
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Compartilhe sua experiência com este produto..."
                ></textarea>
              </div>
              <Button onClick={handleSubmitReview}>Enviar avaliação</Button>
            </div>
          </div>
        </div>

        {/* Lista de comentários */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.author}
                      />
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{review.author}</span>
                  </div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-amber-500 text-amber-500"
                            : "fill-muted text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {review.date}
                </span>
              </div>
              <p className="mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
