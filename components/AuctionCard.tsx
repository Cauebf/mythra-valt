"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Gavel } from "lucide-react";
import { useEffect, useState } from "react";

interface AuctionCardProps {
  auction: {
    id: string;
    name: string;
    currentBid: number;
    endTime: string;
    image: string;
    bids: number;
  };
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const { id, name, currentBid, endTime, image, bids } = auction;
  const [timeLeft, setTimeLeft] = useState("");

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

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <Card className="overflow-hidden group rounded-lg border antique-border">
      <Link href={`/auctions/${id}`} className="block overflow-hidden">
        <div className="relative h-[200px] overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute top-2 right-2 bg-[#D4AF37] text-white shadow-md">
            Leilão
          </Badge>
        </div>
      </Link>
      <CardContent className="px-6">
        <Link href={`/auctions/${id}`}>
          <h3 className="font-serif text-xl mb-2 line-clamp-2 text-foreground hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-muted-foreground">Lance atual</p>
            <p className="font-semibold text-lg text-primary">{formattedBid}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Termina em</p>
            <div className="flex items-center text-amber-600 font-medium">
              <Clock className="h-4 w-4 mr-1" />
              {timeLeft}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{bids} lances</p>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full bg-[#D4AF37] text-white hover:bg-[#c29e2f] cursor-pointer"
          size="sm"
        >
          <Gavel className="mr-2 h-4 w-4" />
          Dar Lance
        </Button>
      </CardFooter>
    </Card>
  );
}
