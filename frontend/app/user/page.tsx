"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Gavel,
  Star,
  ShoppingBag,
  Heart,
  Settings,
  User,
  MessageSquare,
  Clock,
  CheckCircle2,
  Truck,
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Dados simulados do usuário
  const user = {
    name: "João Silva",
    email: "joao.silva@email.com",
    avatar: "/placeholder-user.jpg",
    joinDate: "Janeiro 2022",
    rating: 4.8,
    totalPurchases: 12,
    totalSales: 8,
    totalAuctions: 5,
  };

  // Dados simulados de pedidos
  const orders = [
    {
      id: "ORD-12345",
      date: "2023-12-15",
      total: 1250,
      status: "delivered",
      items: [
        {
          id: "1",
          name: "Relógio de Bolso Vintage",
          price: 1250,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
    {
      id: "ORD-12346",
      date: "2023-12-10",
      total: 3800,
      status: "shipped",
      items: [
        {
          id: "2",
          name: "Gramofone Restaurado 1920",
          price: 3800,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
    {
      id: "ORD-12347",
      date: "2023-12-05",
      total: 950,
      status: "processing",
      items: [
        {
          id: "3",
          name: "Máquina de Escrever Remington",
          price: 950,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
  ];

  // Dados simulados de vendas
  const sales = [
    {
      id: "1",
      name: "Moedas Romanas Antigas",
      price: 2200,
      image: "/placeholder.svg?height=300&width=300",
      category: "Numismática",
      status: "active",
    },
    {
      id: "2",
      name: "Cadeira Estilo Luís XV",
      price: 4500,
      image: "/placeholder.svg?height=300&width=300",
      category: "Móveis",
      status: "active",
    },
  ];

  // Dados simulados de leilões
  const auctions = [
    {
      id: "1",
      name: "Pintura a Óleo Século XIX",
      currentBid: 5600,
      endTime: "2023-12-31T23:59:59",
      image: "/placeholder.svg?height=300&width=300",
      bids: 12,
      status: "active",
    },
    {
      id: "2",
      name: "Cômoda Vitoriana",
      currentBid: 4200,
      endTime: "2023-12-28T18:30:00",
      image: "/placeholder.svg?height=300&width=300",
      bids: 8,
      status: "active",
    },
  ];

  // Dados simulados de avaliações recebidas
  const reviews = [
    {
      id: "1",
      user: "Maria Oliveira",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      comment: "Ótimo vendedor! Item exatamente como descrito e envio rápido.",
      date: "2023-12-10",
    },
    {
      id: "2",
      user: "Carlos Santos",
      avatar: "/placeholder-user.jpg",
      rating: 4,
      comment: "Produto em excelente estado. Recomendo!",
      date: "2023-11-25",
    },
    {
      id: "3",
      user: "Ana Pereira",
      avatar: "/placeholder-user.jpg",
      rating: 5,
      comment: "Transação perfeita. Vendedor muito atencioso.",
      date: "2023-11-15",
    },
  ];

  // Dados simulados de itens favoritos
  const favorites = [
    {
      id: "1",
      name: "Espelho Veneziano Antigo",
      price: 2900,
      image: "/placeholder.svg?height=300&width=300",
      category: "Decoração",
    },
    {
      id: "2",
      name: "Conjunto de Porcelana Chinesa",
      price: 3200,
      image: "/placeholder.svg?height=300&width=300",
      category: "Porcelana",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Entregue
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Truck className="h-3 w-3 mr-1" />
            Enviado
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Em processamento
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 shrink-0">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">
              Membro desde {user.joinDate}
            </p>
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="ml-1">{user.rating}</span>
            </div>
          </div>

          <nav className="space-y-1">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <User className="mr-2 h-4 w-4" />
              Visão Geral
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Meus Pedidos
            </Button>
            <Button
              variant={activeTab === "sales" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("sales")}
            >
              <Package className="mr-2 h-4 w-4" />
              Minhas Vendas
            </Button>
            <Button
              variant={activeTab === "auctions" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("auctions")}
            >
              <Gavel className="mr-2 h-4 w-4" />
              Meus Leilões
            </Button>
            <Button
              variant={activeTab === "reviews" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("reviews")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Avaliações
            </Button>
            <Button
              variant={activeTab === "favorites" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("favorites")}
            >
              <Heart className="mr-2 h-4 w-4" />
              Favoritos
            </Button>
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </nav>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1">
          {activeTab === "overview" && (
            <div>
              <h1 className="text-2xl font-serif font-bold mb-6">Meu Perfil</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Compras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-2xl font-bold">
                        {user.totalPurchases}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Vendas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-2xl font-bold">
                        {user.totalSales}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Leilões
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Gavel className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-2xl font-bold">
                        {user.totalAuctions}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h2 className="text-xl font-medium mb-4">Pedidos Recentes</h2>
              {orders.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {orders.slice(0, 2).map((order) => (
                    <Card key={order.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              Pedido #{order.id}
                            </CardTitle>
                            <CardDescription>
                              {new Date(order.date).toLocaleDateString("pt-BR")}
                            </CardDescription>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="relative h-16 w-16 rounded overflow-hidden">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/perfil/pedidos/${order.id}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mb-8">
                  Você ainda não realizou nenhum pedido.
                </p>
              )}

              <h2 className="text-xl font-medium mb-4">Vendas Ativas</h2>
              {sales.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {/* {sales.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))} */}
                </div>
              ) : (
                <p className="text-muted-foreground mb-8">
                  Você não possui nenhuma venda ativa.
                </p>
              )}

              <h2 className="text-xl font-medium mb-4">Leilões Ativos</h2>
              {auctions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* {auctions.slice(0, 3).map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))} */}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Você não possui nenhum leilão ativo.
                </p>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="text-2xl font-serif font-bold mb-6">
                Meus Pedidos
              </h1>

              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Pedido #{order.id}</CardTitle>
                            <CardDescription>
                              {new Date(order.date).toLocaleDateString("pt-BR")}
                            </CardDescription>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <div className="relative h-20 w-20 rounded overflow-hidden">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-bold">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(order.total)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/perfil/pedidos/${order.id}`}>
                            Ver Detalhes
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          Rastrear Pedido
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Você ainda não realizou nenhum pedido.
                </p>
              )}
            </div>
          )}

          {activeTab === "sales" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-serif font-bold">Minhas Vendas</h1>
                <Button asChild>
                  <Link href="/sell/product">Anunciar Produto</Link>
                </Button>
              </div>

              {sales.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* {sales.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))} */}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Você não possui nenhuma venda ativa.
                </p>
              )}
            </div>
          )}

          {activeTab === "auctions" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-serif font-bold">Meus Leilões</h1>
                <Button asChild>
                  <Link href="/sell/auction">Criar Leilão</Link>
                </Button>
              </div>

              {auctions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* {auctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))} */}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Você não possui nenhum leilão ativo.
                </p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h1 className="text-2xl font-serif font-bold mb-6">
                Avaliações Recebidas
              </h1>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage
                              src={review.avatar || "/placeholder.svg"}
                              alt={review.user}
                            />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              {review.user}
                            </CardTitle>
                            <CardDescription>
                              {new Date(review.date).toLocaleDateString(
                                "pt-BR"
                              )}
                            </CardDescription>
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
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Você ainda não recebeu nenhuma avaliação.
                </p>
              )}
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h1 className="text-2xl font-serif font-bold mb-6">
                Meus Favoritos
              </h1>

              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* {favorites.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))} */}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Você não adicionou nenhum item aos favoritos.
                </p>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h1 className="text-2xl font-serif font-bold mb-6">
                Configurações
              </h1>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Nome</p>
                      <p className="text-muted-foreground">{user.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <p className="font-medium">Membro desde</p>
                      <p className="text-muted-foreground">{user.joinDate}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Editar Perfil</Button>
                </CardFooter>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Endereços</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <p className="font-medium">Endereço Principal</p>
                        <Badge>Padrão</Badge>
                      </div>
                      <p>João Silva</p>
                      <p>Rua das Flores, 123</p>
                      <p>Bairro Jardim</p>
                      <p>São Paulo, SP - 01234-567</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Gerenciar Endereços</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Senha</p>
                      <p className="text-muted-foreground">********</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Alterar Senha</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
