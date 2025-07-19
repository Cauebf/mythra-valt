import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CTA() {
  return (
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
              cuidadosamente selecionadas.
            </p>
            <p className="mb-6">
              Nossa equipe de especialistas garante que cada peça atenda aos
              nossos rigorosos padrões de qualidade e procedência.
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
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-antique-burgundy/20 rounded-full" />
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-antique-gold/10 rounded-full" />
            <div className="relative z-10 h-100 overflow-hidden rounded-lg antique-border">
              <Image
                src="https://images.unsplash.com/photo-1541987736-41744aa9b7d7?w=500&auto=format&fit=crop&q=60"
                alt="Interior de loja de antiguidades"
                fill
                className="p-[0.25rem] object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
