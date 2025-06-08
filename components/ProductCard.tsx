import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    discount?: number;
    rating?: number;
    reviewCount?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, price, image, category, discount, rating, reviewCount } = product

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  return (
    <Card className="overflow-hidden group antique-border h-full flex flex-col">
      <Link href={`/products/${id}`} className="block overflow-hidden">
        <div className="relative h-[200px] overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
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

      <CardContent className="flex-grow flex flex-col justify-between">
        <Link href={`/products/${id}`} className="flex flex-col flex-grow">
          <h3 className="font-medium text-lg mb-1 line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < (rating || 0)
                  ? "fill-amber-500 text-amber-500"
                  : "fill-muted text-muted-foreground"
              }`}
            />
          ))}
          {rating && (
            <span className="text-sm text-muted-foreground ml-1">
              ({reviewCount || 0})
            </span>
          )}
        </div>
        <p className="font-bold text-lg">{formattedPrice}</p>
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
