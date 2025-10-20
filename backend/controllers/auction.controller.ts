import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { capitalizeWords } from "../lib/utils.js";
import { Decimal } from "@prisma/client/runtime/library";

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
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : undefined;
    const now = new Date();

    const activeAuctions = await prisma.auction.findMany({
      where: { endTime: { gt: now } },
      include: {
        bids: { orderBy: { amount: "desc" }, take: 1 },
        category: true,
      },
      orderBy: { startTime: "desc" },
    });

    const shuffledAuctions = activeAuctions.sort(() => Math.random() - 0.5);
    const finalAuctions =
      limit !== undefined ? shuffledAuctions.slice(0, limit) : shuffledAuctions;

    res.status(200).json({ auctions: finalAuctions });
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
        bids: {
          orderBy: { amount: "desc" },
          include: {
            bidder: { select: { id: true, name: true, email: true } },
          },
        },
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
      condition,
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

    const formattedTitle = capitalizeWords(title);

    const auction = await prisma.auction.create({
      data: {
        title: formattedTitle,
        description,
        images: uploadedImages,
        era,
        origin,
        material,
        authenticity,
        provenance,
        condition,
        dimensions,
        startingBid: startingBid,
        startTime: start,
        endTime: end,
        ownerId,
        categoryId,
      },
    });

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
    const numericAmount = new Decimal(amount);

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

    res.status(201).json({ bid });
  } catch (error) {
    console.error("Error placing bid:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const getCommentsByAuction = async (req: Request, res: Response) => {
  try {
    const { auctionId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { auctionId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { auctionId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!content) return res.status(400).json({ message: "Missing content" });

    const comment = await prisma.comment.create({
      data: { content, userId, auctionId },
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
