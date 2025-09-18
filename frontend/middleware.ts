import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/perfil", "/dashboard", "/cart", "/sell"];
const authRoutes = ["/auth/login", "/auth/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Bloqueia rotas protegidas se não estiver autenticado
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !accessToken &&
    !refreshToken
  ) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Bloqueia páginas de login/signup se estiver logado
  if (
    authRoutes.some((route) => pathname === route) &&
    (accessToken || refreshToken)
  ) {
    // Redireciona pra home ou dashboard
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}
