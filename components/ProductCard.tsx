import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    discount?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, price, image, category, discount } = product;

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  return (
    <Card className="overflow-hidden group antique-border h-full flex flex-col">
      <Link href={`/produtos/${id}`} className="block overflow-hidden">
        <div className="relative h-[200px] overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transformgroup-hover:scale-105"
          />
          {discount && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              -{discount}%
            </Badge>
          )}
          {category && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              {category}
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="flex-grow">
        <Link href={`/produtos/${id}`}>
          <h3 className="font-medium text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="font-bold text-lg">{formattedPrice}</p>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full cursor-pointer" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
