import { CategoryCardType } from "@types";
import CategoryCard from "../CategoryCard";

const categories: CategoryCardType[] = [
  {
    href: "/products?category=furniture",
    label: "Móveis",
    img: "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=600&auhref=format&fit=crop",
  },
  {
    href: "/products?category=art",
    label: "Arte",
    img: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=600&auhref=format&fit=crop",
  },
  {
    href: "/products?category=silverware",
    label: "Videogames",
    img: "https://images.unsplash.com/photo-1599408981219-70ea455d4b0b?w=500&auto=format&fit=crop&q=60",
  },
  {
    href: "/products?category=jewelry",
    label: "Jóias",
    img: "https://images.unsplash.com/photo-1631832721838-44118cd1fad8?w=500&auto=format&fit=crop&q=60",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
          Navegue por Categoria
        </h2>
        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
          Nossa coleção abrange séculos de artesanato em diversas categorias.
          Encontre o item perfeito para complementar seu ambiente.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
