import type React from "react";
import Link from "next/link";
import SignUpForm from "@components/SignUpForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Criar conta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Faça login
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações pessoais</CardTitle>
            <CardDescription>
              Preencha seus dados para criar sua conta
            </CardDescription>
          </CardHeader>

          <SignUpForm />
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Ao criar uma conta, você concorda com nossos termos de serviço e
            política de privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}
