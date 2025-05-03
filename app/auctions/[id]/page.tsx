"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share, Gavel, Clock, Star, User, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import AuctionCard from "@/components/AuctionCard"

export default function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const [bidAmount, setBidAmount] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<
    {
      id: string
      user: string
      avatar: string
      content: string
      timestamp: string
    }[]
  >([
    {
      id: "1",
      user: "Maria Silva",
      avatar: "/placeholder-user.jpg",
      content: "Este quadro tem certificado de autenticidade?",
      timestamp: "2023-12-20T14:30:00",
    },
    {
      id: "2",
      user: "Antiquário Clássico",
      avatar: "/placeholder-user.jpg",
      content: "Sim, o quadro possui certificado de autenticidade emitido pela Galeria Nacional de Arte em 2010.",
      timestamp: "2023-12-20T14:45:00",
    },
    {
      id: "3",
      user: "João Pereira",
      avatar: "/placeholder-user.jpg",
      content: "Qual é o estado de conservação da moldura?",
      timestamp: "2023-12-21T10:15:00",
    },
    {
      id: "4",
      user: "Antiquário Clássico",
      avatar: "/placeholder-user.jpg",
      content:
        "A moldura está em excelente estado, com pequenos sinais de desgaste consistentes com a idade. Foi restaurada em 2015 por um especialista.",
      timestamp: "2023-12-21T10:30:00",
    },
  ])

  // Dados simulados do leilão
  const auction = {
    id: id,
    name: "Pintura a Óleo Século XIX - Paisagem Europeia",
    currentBid: 5600,
    nextMinimumBid: 5700,
    startingBid: 3000,
    endTime: "2023-12-31T23:59:59",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    description:
      "Pintura a óleo sobre tela representando uma paisagem rural europeia, atribuída ao círculo de artistas da Escola de Barbizon. A obra data de aproximadamente 1860 e apresenta uma cena bucólica com camponeses, árvores frondosas e um rio sereno ao entardecer. Assinatura parcialmente legível no canto inferior direito.",
    category: "Arte",
    dimensions: "70cm x 90cm",
    condition: "Bom estado, com pequenas restaurações",
    provenance: "Coleção particular francesa",
    bids: [
      { user: "Carlos M.", amount: 5600, time: "2023-12-20T18:45:00" },
      { user: "Ana L.", amount: 5400, time: "2023-12-19T14:30:00" },
      { user: "Roberto S.", amount: 5000, time: "2023-12-18T09:15:00" },
      { user: "Juliana P.", amount: 4500, time: "2023-12-17T20:10:00" },
      { user: "Marcos A.", amount: 4000, time: "2023-12-16T11:05:00" },
      { user: "Fernanda C.", amount: 3500, time: "2023-12-15T16:30:00" },
      { user: "Ricardo B.", amount: 3200, time: "2023-12-14T13:45:00" },
      { user: "Luísa M.", amount: 3000, time: "2023-12-13T10:00:00" },
    ],
    seller: {
      id: "seller123",
      name: "Antiquário Clássico",
      rating: 4.8,
      auctions: 42,
    },
    watchers: 24,
  }

  // Leilões relacionados simulados
  const relatedAuctions = [
    {
      id: "2",
      name: "Escultura em Bronze Art Nouveau",
      currentBid: 3200,
      endTime: "2023-12-28T18:30:00",
      image: "/placeholder.svg?height=300&width=300",
      bids: 6,
    },
    {
      id: "3",
      name: "Conjunto de Gravuras Século XVIII",
      currentBid: 1800,
      endTime: "2023-12-29T20:15:00",
      image: "/placeholder.svg?height=300&width=300",
      bids: 4,
    },
    {
      id: "4",
      name: "Miniatura Pintada à Mão",
      currentBid: 950,
      endTime: "2023-12-30T15:45:00",
      image: "/placeholder.svg?height=300&width=300",
      bids: 3,
    },
  ]

  const [timeLeft, setTimeLeft] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(auction.endTime).getTime() - new Date().getTime()

      if (difference <= 0) {
        setTimeLeft("Leilão encerrado")
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [auction.endTime])

  const handleBid = () => {
    if (!bidAmount) return

    const amount = Number(bidAmount)
    if (amount < auction.nextMinimumBid) return

    // Aqui seria implementada a lógica para enviar o lance ao servidor
    alert(`Lance de R$ ${amount.toFixed(2)} enviado com sucesso!`)
    setBidAmount("")
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      user: "Você",
      avatar: "/placeholder-user.jpg",
      content: message,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulação de resposta do vendedor
    setTimeout(() => {
      const response = {
        id: `msg-${Date.now() + 1}`,
        user: auction.seller.name,
        avatar: "/placeholder-user.jpg",
        content: "Obrigado pelo seu contato! Responderei em breve.",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
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
            <BreadcrumbLink href="/leiloes">Leilões</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/leiloes?categoria=${auction.category}`}>{auction.category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{auction.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Imagens do leilão */}
        <div className="space-y-4">
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden border">
            <Image
              src={auction.images[selectedImage] || "/placeholder.svg"}
              alt={auction.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {auction.images.map((image, index) => (
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
                  alt={`${auction.name} - imagem ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Informações do leilão */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
              Leilão
            </Badge>
            <Badge variant="outline">{auction.category}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">{auction.name}</h1>
          <div className="flex items-center gap-1 mb-4">
            <Link href={`/vendedor/${auction.seller.id}`} className="text-sm text-muted-foreground hover:text-primary">
              Vendido por {auction.seller.name}
            </Link>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="text-sm ml-1">{auction.seller.rating}</span>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-muted-foreground">Lance atual</p>
                <p className="text-3xl font-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(auction.currentBid)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Termina em</p>
                <div className="flex items-center text-amber-600 font-medium">
                  <Clock className="h-4 w-4 mr-1" />
                  {timeLeft}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {auction.bids.length} lances • {auction.watchers} observando
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Lance mínimo: R$ ${auction.nextMinimumBid}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleBid} disabled={!bidAmount || Number(bidAmount) < auction.nextMinimumBid}>
                  <Gavel className="mr-2 h-5 w-5" />
                  Dar Lance
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="mr-2 h-5 w-5" />
                  Observar
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share className="mr-2 h-5 w-5" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-medium mb-2">Descrição</h2>
            <p className="text-sm text-muted-foreground">{auction.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium">Dimensões</h3>
              <p className="text-sm text-muted-foreground">{auction.dimensions}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Condição</h3>
              <p className="text-sm text-muted-foreground">{auction.condition}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Procedência</h3>
              <p className="text-sm text-muted-foreground">{auction.provenance}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Lance inicial</h3>
              <p className="text-sm text-muted-foreground">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(auction.startingBid)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="bids" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="bids">Histórico de Lances</TabsTrigger>
          <TabsTrigger value="chat">Chat com Vendedor</TabsTrigger>
          <TabsTrigger value="shipping">Envio e Pagamento</TabsTrigger>
        </TabsList>
        <TabsContent value="bids" className="space-y-4">
          <h2 className="text-xl font-medium mb-4">Histórico de Lances</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Usuário</th>
                  <th className="text-left p-3 font-medium">Lance</th>
                  <th className="text-left p-3 font-medium">Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {auction.bids.map((bid, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{bid.user}</td>
                    <td className="p-3">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(bid.amount)}
                    </td>
                    <td className="p-3">{formatDate(bid.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="chat">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-3 border-b">
              <h2 className="font-medium">Chat com o Vendedor</h2>
            </div>
            <ScrollArea className="h-[400px] p-4">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-4 flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.avatar || "/placeholder.svg"} alt={msg.user} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm mt-1">{msg.content}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="p-3 border-t flex gap-2">
              <Input
                placeholder="Envie uma mensagem ao vendedor..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="shipping">
          <h2 className="text-xl font-medium mb-4">Informações de Envio e Pagamento</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Envio</h3>
              <p className="text-sm text-muted-foreground">
                O vendedor é responsável pelo envio seguro do item. O custo de envio será calculado após o encerramento
                do leilão com base no endereço do comprador. Itens frágeis ou de grande porte podem exigir serviços de
                transporte especializados.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Pagamento</h3>
              <p className="text-sm text-muted-foreground">
                Após o encerramento do leilão, o vencedor receberá instruções para pagamento. Aceitamos cartão de
                crédito, transferência bancária e PIX. O pagamento deve ser realizado em até 3 dias úteis após o término
                do leilão.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Taxas</h3>
              <p className="text-sm text-muted-foreground">
                Uma taxa de serviço de 5% será adicionada ao valor final do lance vencedor. Esta taxa cobre os custos de
                operação da plataforma e garantias ao comprador.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Garantias</h3>
              <p className="text-sm text-muted-foreground">
                Todos os itens leiloados em nossa plataforma passam por verificação de autenticidade. Oferecemos
                garantia de devolução em até 14 dias caso o item recebido não corresponda à descrição.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <section className="mb-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Leilões Relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </section>
    </div>
  )
}
