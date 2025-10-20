"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuctionStore } from "@stores/useAuctionStore";
import AuctionCard from "@components/AuctionCard";
import { Auction } from "@types";

export default function FeaturedAuctionsSection() {
  const { loading, activeAuctions, fetchActiveAuctions } = useAuctionStore();

  useEffect(() => {
    fetchActiveAuctions(8);
  }, [fetchActiveAuctions]);

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
          {loading ? (
            <div className="col-span-full text-center text-lg text-gray-600">
              Carregando...
            </div>
          ) : activeAuctions && activeAuctions.length > 0 ? (
            activeAuctions.map((auction: Auction) => (
              <div key={auction.id} className="h-full">
                <AuctionCard auction={auction} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-lg text-gray-600">
              Nenhum leilão ativo
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
