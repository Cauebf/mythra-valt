import Link from "next/link";

export default function FeaturedAuctionsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium">
            Leilões em Andamento
          </h2>
          <Link
            href="/auctions"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
          {/* {activeAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))} */}
        </div>
      </div>
    </section>
  );
}
