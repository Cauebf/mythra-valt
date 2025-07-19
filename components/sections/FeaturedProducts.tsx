import Link from "next/link";
import ProductCard from "../ProductCard";
import { featuredProducts } from "@/lib/placeholder-data";

export default function FeaturedProductsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium">
            Produtos em Destaque
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
