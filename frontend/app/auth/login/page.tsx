import type React from "react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import LoginForm from "@components/LoginForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            Entrar na sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:text-primary/80"
            >
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo de volta</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>

          <LoginForm />
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Contas de demonstração:
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>
              <strong>Admin:</strong> cassio@gmail.com
            </p>
            <p>
              <strong>Usuário:</strong> bob@gmail.com
            </p>
            <p>
              <strong>Senha:</strong> 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
