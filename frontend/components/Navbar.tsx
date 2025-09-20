"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingCart, User, Menu, LogOut, Lock } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect } from "react";
import { useUserStore } from "@stores/useUserStore";
import { useCartStore } from "@stores/useCartStore";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, checkAuth, refreshToken } = useUserStore();
  const { items, fetchCart } = useCartStore();
  const isAdmin = user ? user.isAdmin : false;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  const handleClick = () => {
    refreshToken();
  };

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Produtos", href: "/products" },
    { name: "Leilões", href: "/auctions" },
    { name: "Vender", href: "/sell" },
    { name: "Sobre", href: "/about" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background border-b border-[#d4af371a]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden mr-2 cursor-pointer">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-64 sm:w-72 [&>button]:cursor-pointer"
            >
              <div className="mt-12 flex flex-col gap-6">
                {" "}
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-muted text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="border-t pt-4">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/perfil"
                        className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        Perfil
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/dashboard"
                          className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                          Dashboard
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="text-left px-3 py-2 rounded-md text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted hover:text-primary transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/auth/login"
                        className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                        onClick={handleClick}
                      >
                        Entrar
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                        onClick={handleClick}
                      >
                        Cadastrar
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/">
            <h1 className="font-serif text-2xl font-bold text-primary mr-8">
              Mythra
            </h1>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${
                  pathname === item.href
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-primary transition-colors"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* cart button */}
          {user && (
            <Link href="/cart" className="relative">
              <button className="relative inline-flex items-center p-2 rounded-md hover:bg-muted cursor-pointer">
                <ShoppingCart className="h-5 w-5" />
              </button>

              {items && items.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                  {items.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative cursor-pointer rounded-full hover:bg-muted transition-colors focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>

                <DropdownMenuItem asChild>
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login" onClick={handleClick}>
                  Entrar
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup" onClick={handleClick}>
                  Cadastrar
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
