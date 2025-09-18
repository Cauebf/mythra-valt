import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/db";
import { Prisma } from "../lib/generated/prisma";

export type AuthenticatedUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    isAdmin: true;
    address: true;
    cart: true;
    orders: true;
    favorites: true;
    products: true;
    auctions: true;
    bids: true;
    comments: true;
    reviews: true;
  };
}>;

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// Middleware to check if user is authenticated
export const protectedRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized - No access token provided",
      });
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          address: true,
          cart: true,
          orders: true,
          favorites: true,
          products: true,
          auctions: true,
          bids: true,
          comments: true,
          reviews: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Access token expired" });
      }

      throw error;
    }
  } catch (error) {
    console.error("Error verifying access token:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ message });
  }
};

// Middleware to check if user is admin
export const adminRoute = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
