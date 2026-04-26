import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const enableQueryLogs = process.env.PRISMA_QUERY_LOGS === "true";

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: enableQueryLogs ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
