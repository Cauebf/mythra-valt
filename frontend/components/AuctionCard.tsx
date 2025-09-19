"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { Auction } from "@types";

export default function AuctionCard({ auction }: { auction?: Auction | null }) {
  // safe fallbacks
  const id = auction?.id ?? "0";
  const title = auction?.title ?? "Leilão sem título";
  const images = auction?.images ?? [];
  const image = images.length > 0 ? images[0] : "/placeholder.svg";
  const category =
    (auction as any)?.category?.name ?? auction?.categoryId ?? "";
  const bidsArr = auction?.bids ?? [];
  const bidsCount = bidsArr?.length ?? 0;

  // determine current (highest) bid or startingBid
  const highestBidRaw =
    bidsArr && bidsArr.length > 0 ? bidsArr[0].amount : null;
  const startingBidRaw = (auction?.startingBid as any) ?? 0;
  const numericHighest = highestBidRaw
    ? typeof highestBidRaw === "string"
      ? parseFloat(highestBidRaw)
      : (highestBidRaw as number)
    : null;
  const numericStarting =
    typeof startingBidRaw === "string"
      ? parseFloat(startingBidRaw)
      : (startingBidRaw as number);

  const currentBid = numericHighest ?? numericStarting ?? 0;

  const formattedBid = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(currentBid || 0));

  // time left state
  const endTimeRaw = auction?.endTime ?? null;
  const endDate = endTimeRaw ? new Date(endTimeRaw) : null;

  const [timeLeft, setTimeLeft] = useState<string>(() => {
    if (!endDate) return "—";
    const diff = endDate.getTime() - Date.now();
    if (diff <= 0) return "Encerrado";
    return formatDiff(diff);
  });
  const [isEnding, setIsEnding] = useState<boolean>(() => {
    if (!endDate) return false;
    const diff = endDate.getTime() - Date.now();
    return diff > 0 && diff < 2 * 60 * 60 * 1000;
  });

  useEffect(() => {
    if (!endDate) return;
    const tick = () => {
      const diff = endDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Encerrado");
        setIsEnding(false);
        return;
      }
      setTimeLeft(formatDiff(diff));
      setIsEnding(diff < 2 * 60 * 60 * 1000);
    };

    // update every 1s for a smooth countdown (seconds shown when <1h)
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endTimeRaw]);

  // helper: format milliseconds difference
  function formatDiff(ms: number) {
    if (ms <= 0) return "Encerrado";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
    return `${seconds}s`;
  }

  return (
    <div className="group">
      <Link href={`/auctions/${id}`} className="block h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-50 mb-2 rounded-md border">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />

          {category && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="text-xs bg-white/90 text-gray-700 hover:bg-white/90"
              >
                {category}
              </Badge>
            </div>
          )}

          {isEnding && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-red-600 hover:bg-red-600 text-white text-xs px-2 py-1 font-normal">
                Encerrando
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3
            className="text-sm text-gray-900 line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap"
            title={title}
          >
            {title}
          </h3>

          {/* Current Bid */}
          <div>
            <p className="text-xs text-muted-foreground">Lance atual</p>
            <p className="text-lg font-semibold text-emerald-700">
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
              <span>
                {bidsCount} {bidsCount === 1 ? "lance" : "lances"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
