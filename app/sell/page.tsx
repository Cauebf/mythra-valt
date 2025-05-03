import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Gavel, ArrowRight } from "lucide-react"

export default function SellPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-2">Venda suas antiguidades</h1>
        <p className="text-muted-foreground mb-8">
          Escolha como deseja vender seus itens de coleção e antiguidades para entusiastas de todo o país.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="group hover:shadow-md transition-all">
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Venda Direta</CardTitle>
              <CardDescription>
                Anuncie seus itens com preço fixo para venda imediata aos compradores interessados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Venda rápida com preço definido por você
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Controle total sobre a disponibilidade
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Taxa de serviço de apenas 5%
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/20 text-primary rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Ideal para itens com valor de mercado estabelecido
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full group-hover:bg-primary/90">
                <Link href="/sell/product">
                  Anunciar Produto
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader>
              <div className="bg-amber-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Gavel className="h-6 w-6 text-amber-500" />
              </div>
              <CardTitle>Leilão</CardTitle>
              <CardDescription>
                Crie um leilão para itens raros ou valiosos e deixe os compradores competirem pelo melhor lance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="bg-amber-500/20 text-amber-500 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Potencial para alcançar valor de mercado mais alto
                </li>
                <li className="flex items-center">
                  <span className="bg-amber-500/20 text-amber-500 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Ideal para peças raras, únicas ou de colecionador
                </li>
                <li className="flex items-center">
                  <span className="bg-amber-500/20 text-amber-500 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Chat direto com potenciais compradores
                </li>
                <li className="flex items-center">
                  <span className="bg-amber-500/20 text-amber-500 rounded-full w-5 h-5 inline-flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Taxa de serviço de 7.5% sobre o lance vencedor
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="w-full group-hover:border-amber-500 group-hover:text-amber-500"
              >
                <Link href="/sell/auction">
                  Criar Leilão
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-medium mb-4">Dicas para vendedores</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Fotos de qualidade</h3>
              <p className="text-sm text-muted-foreground">
                Tire fotos em boa iluminação, mostrando todos os ângulos e detalhes do item, incluindo eventuais
                imperfeições.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Descrição detalhada</h3>
              <p className="text-sm text-muted-foreground">
                Inclua informações sobre origem, idade, estado de conservação, dimensões e qualquer história relevante
                sobre o item.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Precificação adequada</h3>
              <p className="text-sm text-muted-foreground">
                Pesquise itens similares para definir um preço justo. Para leilões, considere um lance inicial atrativo
                para gerar interesse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
