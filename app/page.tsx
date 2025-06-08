import AuctionCard from "@/components/AuctionCard";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { activeAuctions, featuredProducts } from "@/lib/placeholder-data";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1552248524-10d9a7e4841c?q=80&w=1920&auhref=format&fit=crop"
            alt="Coleção antiga"
            fill
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 max-w-3xl">
            Descubra Tesouros Atemporais para Sua Coleção
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Explore nossa seleção cuidadosamente curada de antiguidades raras e
            objetos de coleção vintage. Compre itens com preço fixo ou participe
            de leilões exclusivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="text-medium bg-primary hover:bg-primary/90 text-white text-lg font-normal py-6 px-8"
            >
              <Link href="/products">Explorar Loja</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white text-lg font-normal py-6 px-8"
            >
              <Link href="/auctions">Ver Leilões</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-center">
            Navegue por Categoria
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Nossa coleção abrange séculos de artesanato em diversas categorias.
            Encontre o item perfeito para complementar seu ambiente.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              href="/shop?category=furniture"
              className="group relative overflow-hidden rounded-lg antique-border"
            >
              <div className="aspect-square bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=600&auhref=format&fit=crop"
                  alt="Móveis"
                  fill
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <h3 className="absolute bottom-3 left-3 text-xl font-serif text-white">
                Móveis
              </h3>
            </Link>

            <Link
              href="/shop?category=art"
              className="group relative overflow-hidden rounded-lg antique-border"
            >
              <div className="aspect-square bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=600&auhref=format&fit=crop"
                  alt="Arte"
                  fill
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <h3 className="absolute bottom-3 left-3 text-xl font-serif text-white">
                Arte
              </h3>
            </Link>

            <Link
              href="/shop?category=silverware"
              className="group relative overflow-hidden rounded-lg antique-border"
            >
              <div className="aspect-square bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1599408981219-70ea455d4b0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZpZGVvZ2FtZSUyMHJldHJvfGVufDB8fDB8fHww"
                  alt="Videogames"
                  fill
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <h3 className="absolute bottom-3 left-3 text-xl font-serif text-white">
                Videogames
              </h3>
            </Link>

            <Link
              href="/shop?category=jewelry"
              className="group relative overflow-hidden rounded-lg antique-border"
            >
              <div className="aspect-square bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1631832721838-44118cd1fad8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGpld2VscnklMjBhbnRpcXVlfGVufDB8fDB8fHww"
                  alt="Joias"
                  fill
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <h3 className="absolute bottom-3 left-3 text-xl font-serif text-white">
                Jóias
              </h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-medium">
              Produtos em Destaque
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Auctions Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-medium">
              Leilões em Andamento
            </h2>
            <Link
              href="/auctions"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* About/CTA Section */}
      <section className="py-20 bg-[#1D3557] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">
                Trazendo História para o Seu Lar
              </h2>
              <p className="mb-4">
                Na Cassio Ruins, somos apaixonados por preservar a história e
                conectar colecionadores com antiguidades autênticas e
                cuidadosamente selecionadas. Cada item em nossa coleção conta
                uma história e carrega em si o artesanato de uma era passada.
              </p>
              <p className="mb-6">
                Nossa equipe de especialistas em autenticação garante que cada
                peça atenda aos nossos rigorosos padrões de qualidade e
                procedência. Seja você um colecionador experiente ou alguém
                iniciando sua jornada, estamos aqui para ajudá-lo a encontrar
                tesouros que tenham significado para você.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-[#D4AF37] text-foreground hover:bg-[#D4AF37]/90"
                >
                  <Link href="/auctions">Participe de Nossos Leilões</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-foreground hover:bg-white/10 hover:text-white"
                >
                  <Link href="/create-listing">Venda Conosco</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-antique-burgundy/20 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-antique-gold/10 rounded-full"></div>
              <div className="relative z-10 h-100 rounded-lg overflow-hidden antique-border">
                <Image
                  src="https://images.unsplash.com/photo-1541987736-41744aa9b7d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGFudGlxdWV8ZW58MHwwfDB8fHww"
                  alt="Interior de loja de antiguidades"
                  fill
                  className="w-full p-[0.25rem] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
