import { Prisma, PrismaClient as PrismaOriginClient } from "@prisma/client";

export type PrismaClient = Prisma.TransactionClient | PrismaOriginClient;
