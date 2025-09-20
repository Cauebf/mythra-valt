import { PrismaClient } from "./generated/prisma/index.js";
import doentv from "dotenv";

doentv.config();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
