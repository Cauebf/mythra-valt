import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import auctionRoutes from "./routes/auction.route.js";
import categoryRoutes from "./routes/category.route.js";
import reviewsRoutes from "./routes/review.route.js";
import favoriteRoutes from "./routes/favorite.route.js";
import cartRoutes from "./routes/cart.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:3000", `${process.env.CLIENT_URL}`];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/comments", commentRoutes);

const start = async () => {
  app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
};

start();
