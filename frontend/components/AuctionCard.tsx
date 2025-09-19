"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Auction } from "@types";

export default function AuctionCard({ auction }: { auction: Auction }) {
  // const { id, name, currentBid, endTime, image, bids } = auction;
  const id = 1;
  const name = "Auction 1";
  const currentBid = 100;
  const endTime = "2023-12-31T23:59:59";
  const image =
    "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGludHVyYSUyMGElMjBvbGVvfGVufDB8fDB8fHww";
  const bids = 12;

  const [timeLeft, setTimeLeft] = useState("");
  const [isEnding, setIsEnding] = useState(false);

  const formattedBid = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(currentBid);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft("Encerrado");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      // Check if auction is ending soon (less than 2 hours)
      setIsEnding(difference < 2 * 60 * 60 * 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="group">
      <Link href={`/auctions/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-2">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          {isEnding && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-red-600 hover:bg-red-600 text-white text-xs px-2 py-1 font-normal">
                Encerrando
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm text-gray-900 line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </h3>

          {/* Current Bid */}
          <div>
            <p className="text-xs text-gray-600">Lance atual</p>
            <p className="text-lg font-semibold text-green-700">
              {formattedBid}
            </p>
          </div>

          {/* Time and Bids Info */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className={isEnding ? "text-red-600 font-medium" : ""}>
                {timeLeft}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{bids} lances</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
