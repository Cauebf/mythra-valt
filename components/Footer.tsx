import Link from "next/link";
import { Github, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1D3557] text-[#F5F1E6] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif text-[#D4AF37] mb-4">
              Mythra Valt
            </h3>
            <p className="text-sm text-[#F5F1E6]/80 mb-4">
              Descubra tesouros atemporais e raras antiguidades de todo o mundo.
              Trazendo história para sua casa desde 2025.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-serif text-[#D4AF37] mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className="text-[#F5F1E6]/80 hover:text-[#D4AF37] transition-colors"
                >
                  Todas as Antiguidades
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions"
                  className="text-[#F5F1E6]/80 hover:text-[#D4AF37] transition-colors"
                >
                  Leilões Atuais
                </Link>
              </li>
              <li>
                <Link
                  href="/create-listing"
                  className="text-[#F5F1E6]/80 hover:text-[#D4AF37] transition-colors"
                >
                  Venda Conosco
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif text-[#D4AF37] mb-4">
              Informações
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-[#F5F1E6]/80 hover:text-[#D4AF37] transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#F5F1E6]/80 hover:text-[#D4AF37] transition-colors"
                >
                  Envio & Devoluções
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#F5F1E6]/80 hover:text-[#D4AF37] transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#F5F1E6]/80 hover:text-[#D4AF37] transition-colors"
                >
                  Termos & Condições
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif text-[#D4AF37] mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="text-[#F5F1E6]/80">123 Street</li>
              <li className="text-[#F5F1E6]/80">Cidade Feliz, VC 10001</li>
              <li className="text-[#F5F1E6]/80">+1 (123) 456-7890</li>
              <li className="text-[#F5F1E6]/80">contact@mythravalt.com</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-[#D4AF37] hover:text-[#F5F1E6] transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-[#D4AF37] hover:text-[#F5F1E6] transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <Github className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-[#D4AF37] hover:text-[#F5F1E6] transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#F5F1E6]/10 text-center text-sm text-[#F5F1E6]/60">
          <p>
            &copy; {new Date().getFullYear()} Mythra Valt. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
