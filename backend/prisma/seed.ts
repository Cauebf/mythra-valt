import { prisma } from "../lib/db";

async function main() {
  console.log("🌱 Seeding database...");

  // Create User
  const user = await prisma.user.create({
    data: {
      name: "Alice Doe",
      email: "alice@example.com",
      password: "hashed-password", 
      isAdmin: true,
      avatar: "https://example.com/avatar.jpg",
      address: {
        create: {
          street: "123 Main St",
          city: "São Paulo",
          state: "SP",
          country: "Brazil",
        },
      },
    },
  });

  // Create Categories
  const paintingCategory = await prisma.category.create({
    data: {
      name: "Pinturas",
    },
  });

  const sculptureCategory = await prisma.category.create({
    data: {
      name: "Esculturas",
    },
  });

  // Create Product
  const product = await prisma.product.create({
    data: {
      title: "Pintura Antiga",
      description: "Uma bela pintura do século XIX.",
      price: 1200.5,
      images: ["https://example.com/pintura.jpg"],
      condition: "GOOD",
      weight: 2.5,
      dimensions: "40x50x5",
      era: "Século XIX",
      origin: "França",
      material: "Óleo sobre tela",
      authenticity: "VERIFIED",
      provenance: "Coleção privada",
      certificateUrl: "https://example.com/certificado.pdf",
      ownerId: user.id,
      categoryId: paintingCategory.id,
    },
  });

  // Create Auction
  const auction = await prisma.auction.create({
    data: {
      title: "Escultura Rara",
      description: "Escultura em mármore datada do século XVIII.",
      images: ["https://example.com/escultura.jpg"],
      era: "Século XVIII",
      origin: "Itália",
      material: "Mármore",
      authenticity: "GUARANTEED",
      provenance: "Galeria de arte histórica",
      certificateUrl: "https://example.com/auction_cert.pdf",
      dimensions: "60x30x30",
      startingBid: 2500.0,
      startTime: new Date(Date.now()),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ownerId: user.id,
      categoryId: sculptureCategory.id,
    },
  });

  // Create Review
  await prisma.review.create({
    data: {
      rating: 5,
      content: "Excelente qualidade e autenticidade.",
      userId: user.id,
      productId: product.id,
    },
  });

  // Create Comment (Product)
  await prisma.comment.create({
    data: {
      content: "Essa pintura é maravilhosa!",
      userId: user.id,
      productId: product.id,
    },
  });

  // Create Comment (Auction)
  await prisma.comment.create({
    data: {
      content: "Essa escultura é legítima?",
      userId: user.id,
      auctionId: auction.id,
    },
  });

  // Create Bid
  await prisma.bid.create({
    data: {
      amount: 2750.0,
      auctionId: auction.id,
      userId: user.id,
    },
  });

  // Create Cart and CartItem
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: product.id,
      quantity: 1,
    },
  });

  // Create Order and OrderItem
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: 1200.5,
      stripeSessionId: "sess_123456789",
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: product.id,
      price: 1200.5,
      quantity: 1,
    },
  });

  // Create Favorite
  await prisma.favorite.create({
    data: {
      userId: user.id,
      productId: product.id,
    },
  });

  console.log("✅ Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
