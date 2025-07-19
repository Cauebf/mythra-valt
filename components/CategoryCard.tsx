import { Category } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      className="group relative overflow-hidden rounded-lg antique-border"
    >
      <div className="aspect-square bg-muted">
        <Image
          src={category.img}
          alt={category.label}
          fill
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <h3 className="absolute bottom-3 left-3 text-xl font-serif text-white">
        {category.label}
      </h3>
    </Link>
  );
}
