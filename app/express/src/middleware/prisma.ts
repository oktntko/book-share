import { originPrisma } from '~/lib/prisma';
import type { ITXClientDenyList } from '@prisma/client/runtime/library';

export const prisma = originPrisma.$extends({});

type ExtendsPrismaClient = typeof prisma;
type TransactionExtendsPrismaClient = Omit<ExtendsPrismaClient, ITXClientDenyList>;

export type PrismaClient = ExtendsPrismaClient | TransactionExtendsPrismaClient;
