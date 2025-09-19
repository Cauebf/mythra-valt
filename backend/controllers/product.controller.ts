import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import redis from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
    });

    await redis.set(
      "mythra_featured_products",
      JSON.stringify(featuredProducts)
    );
  } catch (error) {
    console.error("Error updating featured products cache:", error);
  }
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting products:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const cached = await redis.get("mythra_featured_products");
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
    });

    if (featuredProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    await redis.set(
      "mythra_featured_products",
      JSON.stringify(featuredProducts)
    );
    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error("Error getting featured products:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      price,
      quantity,
      images,
      condition,
      categoryId,
      dimensions,
      era,
      origin,
      material,
      authenticity,
      provenance,
    } = req.body;
    const ownerId = req?.user?.id;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let uploadedImages: string[] = [];

    if (images && images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "mythra_products",
        });
        uploadedImages.push(result.secure_url);
      }
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        images: uploadedImages,
        condition,
        categoryId,
        ownerId,
        dimensions,
        era,
        origin,
        material,
        authenticity,
        provenance,
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error("Error creating product:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`mythra_products/${publicId}`);
            console.log(`Deleted image ${publicId} from Cloudinary`);
          } catch (error) {
            console.error("Cloudinary delete error:", error);
          }
        }
      }
    }

    await prisma.product.delete({ where: { id } });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;

  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: category,
        },
      },
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting products by category:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const toggleFeaturedProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
    });

    await updateFeaturedProductsCache();

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    console.error("Error toggling featured product:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};
