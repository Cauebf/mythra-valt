import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

async function updateActiveAuctionsCache() {
  try {
    const now = new Date();
    const activeAuctions = await prisma.auction.findMany({
      where: { endTime: { gt: now } },
      orderBy: { startTime: "desc" },
    });

    await redis.set("mythra_active_auctions", JSON.stringify(activeAuctions));
  } catch (error) {
    console.error("Error updating active auctions cache:", error);
  }
}

export const getAllAuctions = async (req: Request, res: Response) => {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        bids: {
          orderBy: { amount: "desc" },
          take: 1,
        },
        category: true,
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ auctions });
  } catch (error) {
    console.error("Error getting auctions:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const getActiveAuctions = async (req: Request, res: Response) => {
  try {
    const cached = await redis.get("mythra_active_auctions");
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const now = new Date();
    const activeAuctions = await prisma.auction.findMany({
      where: { endTime: { gt: now } },
      include: {
        bids: { orderBy: { amount: "desc" }, take: 1 },
        category: true,
      },
      orderBy: { startTime: "desc" },
    });

    await redis.set("mythra_active_auctions", JSON.stringify(activeAuctions));

    res.status(200).json(activeAuctions);
  } catch (error) {
    console.error("Error getting active auctions:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const getAuctionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        bids: { orderBy: { amount: "desc" } },
        category: true,
        owner: { select: { id: true, name: true, email: true } },
        comments: true,
      },
    });

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.status(200).json({ auction });
  } catch (error) {
    console.error("Error getting auction by id:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const createAuction = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      images,
      startingBid,
      startTime,
      endTime,
      categoryId,
      era,
      origin,
      material,
      authenticity,
      provenance,
      certificateUrl,
      dimensions,
    } = req.body;

    const ownerId = req?.user?.id;
    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !title ||
      !description ||
      !startingBid ||
      !startTime ||
      !endTime ||
      !categoryId
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields for auction creation" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res
        .status(400)
        .json({ message: "Invalid startTime/endTime. Ensure start < end." });
    }

    let uploadedImages: string[] = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "mythra_auctions",
        });
        uploadedImages.push(result.secure_url);
      }
    }

    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        images: uploadedImages,
        era,
        origin,
        material,
        authenticity,
        provenance,
        certificateUrl,
        dimensions,
        startingBid: startingBid,
        startTime: start,
        endTime: end,
        ownerId,
        categoryId,
      },
    });

    // update cache of active auctions (if needed)
    await updateActiveAuctionsCache();

    res.status(201).json({ auction });
  } catch (error) {
    console.error("Error creating auction:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const deleteAuction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const auction = await prisma.auction.findUnique({
      where: { id },
    });

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Delete images from Cloudinary if present
    if (auction.images && auction.images.length > 0) {
      for (const imageUrl of auction.images) {
        const publicId = imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`mythra_auctions/${publicId}`);
            console.log(`Deleted auction image ${publicId} from Cloudinary`);
          } catch (error) {
            console.error("Cloudinary delete error:", error);
          }
        }
      }
    }

    await prisma.auction.delete({ where: { id } });

    // refresh active auctions cache
    await updateActiveAuctionsCache();

    res.status(200).json({ message: "Auction deleted successfully" });
  } catch (error) {
    console.error("Error deleting auction:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const getAuctionsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;

    const auctions = await prisma.auction.findMany({
      where: {
        category: { name: category },
      },
      include: {
        bids: { orderBy: { amount: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ auctions });
  } catch (error) {
    console.error("Error getting auctions by category:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const placeBid = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: auctionId } = req.params;
    const { amount } = req.body;
    const bidderId = req?.user?.id;

    if (!bidderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!amount) {
      return res.status(400).json({ message: "Missing bid amount" });
    }

    const auction = await prisma.auction.findUnique({
      where: { id: auctionId },
      include: { bids: { orderBy: { amount: "desc" } } },
    });

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const now = new Date();
    if (now < auction.startTime) {
      return res.status(400).json({ message: "Auction hasn't started yet" });
    }
    if (now > auction.endTime) {
      return res.status(400).json({ message: "Auction has already ended" });
    }

    // determine current highest bid
    const highestBid =
      auction.bids && auction.bids.length > 0 ? auction.bids[0] : null;
    const numericAmount = amount;

    // Validate amount > highestBid.amount (if present) or >= startingBid
    if (highestBid) {
      if (numericAmount.lte(highestBid.amount)) {
        return res
          .status(400)
          .json({ message: "Bid must be greater than current highest bid" });
      }
    } else {
      // no bids yet: must be >= startingBid
      if (numericAmount.lt(auction.startingBid)) {
        return res
          .status(400)
          .json({ message: "Bid must be at least the starting bid" });
      }
    }

    const bid = await prisma.bid.create({
      data: {
        amount: numericAmount,
        auctionId,
        userId: bidderId,
      },
    });

    await updateActiveAuctionsCache();

    res.status(201).json({ bid });
  } catch (error) {
    console.error("Error placing bid:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};
