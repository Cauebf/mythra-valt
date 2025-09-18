import HeroSection from "@/components/sections/Hero";
import CategoriesSection from "@/components/sections/Categories";
import FeaturedProductsSection from "@/components/sections/FeaturedProducts";
import FeaturedAuctionsSection from "@/components/sections/FeaturedAuctions";
import CTA from "@/components/sections/CTA";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <FeaturedAuctionsSection />
      <CTA />
    </>
  );
}
