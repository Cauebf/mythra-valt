"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingCart, User, Menu, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Produtos", href: "/produtos" },
    { name: "Leilões", href: "/leiloes" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden mr-2">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-10 mx-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-serif text-lg hover:text-primary transition-colors ${
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-serif text-3xl font-bold text-primary mr-8">
            Antiqua
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-serif text-sm hover:text-primary transition-colors ${
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="relative hidden md:block">
              <Input type="search" placeholder="Buscar antiguidades..." className="w-[200px] lg:w-[300px]" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setIsSearchOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Buscar</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild>
            <Link href="/carrinho">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrinho</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Perfil" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/perfil">Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/perfil/vendas">Minhas Vendas</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/perfil/leiloes">Meus Leilões</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/perfil/pedidos">Meus Pedidos</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/auth/logout">Sair</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
