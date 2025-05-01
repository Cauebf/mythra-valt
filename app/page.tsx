import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552248524-10d9a7e4841c?q=80&w=1920&auhref=format&fit=crop"
            alt="Antique collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 max-w-3xl">
            Discover Timeless Treasures for Your Collection
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            Explore our curated selection of rare antiques and vintage
            collectibles. Shop fixed-price items or participate in exclusive
            auctions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="text-medium bg-primary hover:bg-primary/90 text-white text-lg font-normal py-6 px-8"
            >
              <Link href="/shop">Explore Shop</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white text-lg font-normal py-6 px-8"
            >
              <Link href="/auctions">View Auctions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-antique-paper paper-texture">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-center">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Our collection spans centuries of craftsmanship across various
            categories. Find the perfect addition to your home.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              href="/shop?category=furniture"
              className="group relative overflow-hidden rounded-lg antique-border"
            >
              <div className="aspect-square bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=600&auhref=format&fit=crop"
                  alt="Furniture"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <h3 className="absolute bottom-3 left-3 text-xl font-serif text-white">
                Furniture
              </h3>
            </Link>

            <Link
              href="/shop?category=art"
              className="group relative overflow-hidden rounded-lg antique-border"
            >
              <div className="aspect-square bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=600&auhref=format&fit=crop"
                  alt="Art"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <h3 className="absolute bottom-3 left-3 text-xl font-serif text-white">
                Art
              </h3>
            </Link>

            <Link
              href="/shop?category=silverware"
              className="group relative overflow-hidden rounded-lg antique-border"
            >
              <div className="aspect-square bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?q=80&w=600&auhref=format&fit=crop"
                  alt="Silverware"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <h3 className="absolute bottom-3 left-3 text-xl font-serif text-white">
                Silverware
              </h3>
            </Link>

            <Link
              href="/shop?category=jewelry"
              className="group relative overflow-hidden rounded-lg antique-border"
            >
              <div className="aspect-square bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1616101054811-26065ff58233?q=80&w=600&auhref=format&fit=crop"
                  alt="Jewelry"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <h3 className="absolute bottom-3 left-3 text-xl font-serif text-white">
                Jewelry
              </h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      {/* <FeaturedItems /> */}

      {/* About/CTA Section */}
      <section className="py-20 bg-[#1D3557] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">
                Bringing History to Your Home
              </h2>
              <p className="mb-4">
                At Relic Realm, we're passionate about preserving history and
                connecting collectors with authentic, carefully curated
                antiquities. Each item in our collection tells a story and holds
                within it the craftsmanship of a bygone era.
              </p>
              <p className="mb-6">
                Our team of expert authenticators ensures that every piece meets
                our rigorous standards for quality and provenance. Whether
                you're an experienced collector or just beginning your journey,
                we're here to help you find treasures that speak to you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-[#D4AF37] text-foreground hover:bg-[#D4AF37]/90"
                >
                  <Link href="/auctions">Join Our Auctions</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-foreground hover:bg-white/10 hover:text-white"
                >
                  <Link href="/create-listing">Sell With Us</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-antique-burgundy/20 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-antique-gold/10 rounded-full"></div>
              <div className="relative z-10 rounded-lg overflow-hidden antique-border">
                <img
                  src="https://images.unsplash.com/photo-1523159888831-35827362e837?q=80&w=1000&auhref=format&fit=crop"
                  alt="Antique shop interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
