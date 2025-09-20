import express from "express";
import {
  getAllAuctions,
  getActiveAuctions,
  getAuctionById,
  createAuction,
  deleteAuction,
  getAuctionsByCategory,
  placeBid,
  getCommentsByAuction,
  createComment,
} from "../controllers/auction.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllAuctions);
router.get("/active", getActiveAuctions);
router.get("/category/:category", getAuctionsByCategory);
router.get("/:id", getAuctionById);
router.get("/:auctionId/comments", getCommentsByAuction);
router.post("/:auctionId/comments", protectedRoute, createComment);
router.post("/", protectedRoute, createAuction);
router.post("/:auctionId/bid", protectedRoute, placeBid);
router.delete("/:id", protectedRoute, deleteAuction);

export default router;
