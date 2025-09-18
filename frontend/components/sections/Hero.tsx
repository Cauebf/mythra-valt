import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1552248524-10d9a7e4841c?q=80&w=1920&auhref=format&fit=crop"
          alt="Coleção antiga"
          fill
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
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
            className="text-lg font-normal py-6 px-8 bg-primary hover:bg-primary/90 text-white"
          >
            <Link href="/products">Explorar Loja</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-lg font-normal py-6 px-8 bg-transparent border-white text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/auctions">Ver Leilões</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
