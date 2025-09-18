"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@stores/useUserStore";

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    state: "",
    country: "",
  });
  const { signup, loading } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signup(formData);

    if (res?.message === "error") return;
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Nome completo *</Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              className="pl-10"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">E-mail *</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Campos de endereço */}
        <div>
          <Label className="block mb-2">Endereço</Label>
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Rua *</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="street"
                  type="text"
                  placeholder="Rua, número, complemento"
                  className="pl-10"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="mb-1">
                  Cidade *
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="state" className="mb-1">
                  Estado *
                </Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="Estado"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="country" className="mb-1">
                  País *
                </Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="País"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="password">Senha *</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              className="pl-10 pr-10"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar senha *</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              className="pl-10 pr-10"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full cursor-pointer mt-6"
          disabled={loading}
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </CardFooter>
    </form>
  );
}
